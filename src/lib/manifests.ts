import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import releaseManifestSchema from '../../schemas/release-manifest.schema.json';

export interface ReleaseAsset {
    id: string;
    platform: 'windows';
    architecture: 'x64' | 'arm64';
    packageType: 'installer' | 'portable' | 'archive';
    filename: string;
    url: string;
    fallbackUrl?: string;
    size: number;
    sha256: string;
}

export interface ReleaseManifest {
    schemaVersion: 1;
    productId: string;
    channel: 'stable';
    version: string;
    releasedAt: string;
    summary: string;
    releaseNotesUrl?: string;
    minimumOsVersion?: string;
    assets: ReleaseAsset[];
}

export interface ReleaseManifestSource {
    productId: string;
    url: string;
}

const MANIFEST_TIMEOUT_MS = 10_000;
const MANIFEST_MAX_BYTES = 256 * 1024;

type FetchFunction = typeof globalThis.fetch;

const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

const validateReleaseManifest = ajv.compile<ReleaseManifest>(releaseManifestSchema);

export function parseReleaseManifest(
    input: unknown,
    expectedProductId: string,
): ReleaseManifest {
    if (validateReleaseManifest(input)) {
        const assetIds = new Set(
            input.assets.map((asset) => asset.id),
        );
        if (assetIds.size !== input.assets.length) {
            throw new Error('资产 id 必须唯一');
        }

        const filenames = new Set(
            input.assets.map((asset) => asset.filename),
        );
        if (filenames.size !== input.assets.length) {
            throw new Error('资产 filename 必须唯一');
        }

        const urls = new Set(
            input.assets.map((asset) => asset.url),
        );
        if (urls.size !== input.assets.length) {
            throw new Error('资产 url 必须唯一');
        }

        if (input.productId !== expectedProductId) {
            throw new Error('productId 必须与当前作品一致');
        }

        const downloadDirectory = `/downloads/${encodeURIComponent(expectedProductId)}/`;

        const hasInvalidAssetUrl = input.assets.some((asset) => {
            const pathname = new URL(asset.url).pathname;
            return !pathname.startsWith(downloadDirectory);
        });
        if (hasInvalidAssetUrl) {
            throw new Error('资产 URL 必须位于当前作品的下载目录');
        }

        const hasMismatchedFilename = input.assets.some((asset) => {
            const pathname = new URL(asset.url).pathname;
            const expectedPath = `${downloadDirectory}${encodeURIComponent(asset.filename)}`;

            return pathname !== expectedPath;
        });
        if (hasMismatchedFilename) {
            throw new Error('资产 URL 文件名必须与 filename 一致');
        }

        return input;
    }

    const details = ajv.errorsText(
        validateReleaseManifest.errors,
        { separator: '; ' },
    );

    throw new Error(`发布清单校验失败：${details}`);
}

export async function fetchReleaseManifest(
    url: string,
    expectedProductId: string,
    fetchImpl: FetchFunction = globalThis.fetch,
): Promise<ReleaseManifest> {
    const manifestUrl = new URL(url);

    if (manifestUrl.protocol !== 'https:') {
        throw new Error('发布清单 URL 必须使用 HTTPS');
    }

    const expectedManifestPath = `/downloads/${encodeURIComponent(expectedProductId)}/stable.json`;

    if (manifestUrl.pathname !== expectedManifestPath) {
        throw new Error('发布清单 URL 必须位于当前作品的下载目录');
    }

    const response = await fetchImpl(manifestUrl, {
        signal: AbortSignal.timeout(MANIFEST_TIMEOUT_MS),
    });

    if (!response.ok) {
        throw new Error(
            `发布清单请求失败：HTTP ${response.status}`,
        );
    }

    const contentLength = response.headers.get('content-length');

    if (
        contentLength !== null
        && Number(contentLength) > MANIFEST_MAX_BYTES
    ) {
        throw new Error('发布清单响应超过 256 KiB');
    }

    if (response.body === null) {
        throw new Error('发布清单响应体为空');
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            totalBytes += value.byteLength;

            if (totalBytes > MANIFEST_MAX_BYTES) {
                await reader.cancel();
                throw new Error('发布清单响应超过 256 KiB');
            }

            chunks.push(value);
        }
    } finally {
        reader.releaseLock();
    }

    const body = new Uint8Array(totalBytes);
    let offset = 0;

    for (const chunk of chunks) {
        body.set(chunk,offset);
        offset += chunk.byteLength;
    }

    const jsonText = new TextDecoder(
        'utf-8',
        { fatal: true},
    ).decode(body);

    let input: unknown;

    try {
        input = JSON.parse(jsonText);
    } catch (error) {
        throw new Error('发布清单不是有效 JSON', { cause: error });
    }

    const manifest = parseReleaseManifest(input, expectedProductId);

    const hasCrossOriginAsset = manifest.assets.some(
        (asset) => new URL(asset.url).origin !== manifestUrl.origin,
    );

    if (hasCrossOriginAsset) {
        throw new Error('资产 URL 必须与发布清单同源');
    }

    return manifest;
}

export async function fetchReleaseManifests(
    sources: ReleaseManifestSource[],
    fetchImpl: FetchFunction = globalThis.fetch,
): Promise<Map<string, ReleaseManifest>> {
    const manifests = new Map<string, ReleaseManifest>();

    for (const source of sources) {
        const manifest = await fetchReleaseManifest(
            source.url,
            source.productId,
            fetchImpl,
        );

        manifests.set(source.productId, manifest);
    }

    return manifests;
}