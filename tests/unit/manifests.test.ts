import { expect, test } from 'vitest';
import validManifest from '../fixtures/release-manifest.valid.json';
import { 
    parseReleaseManifest,
    fetchReleaseManifest,
    fetchReleaseManifests,
} from '../../src/lib/manifests';

test('有效发布清单解析成功', () => {
    const manifest = parseReleaseManifest(validManifest, 'fixture-app');

    expect(manifest.productId).toBe('fixture-app');
    expect(manifest.version).toBe('1.2.3');
});

test('SHA256 无效时拒绝发布清单', () => {
    const invalidManifest = {
        ...validManifest,
        assets: [
            {
                ...validManifest.assets[0],
                sha256: 'invalid',
            },
        ],
    };

    expect(() => parseReleaseManifest(invalidManifest, 'fixture-app'))
        .toThrow('发布清单校验失败');
});

test('资产 ID 重复时拒绝发布清单', () => {
    const firstAsset = validManifest.assets[0];
    const invalidManifest = {
        ...validManifest,
        assets: [
            firstAsset,
            {
                ...firstAsset,
                architecture: 'arm64',
                filename: 'fixture-app-1.2.3-windows-arm64.zip',
                url: 'https://example.com/downloads/fixture-app-1.2.3-windows-arm64.zip',
            },
        ],
    };

    expect(() => parseReleaseManifest(invalidManifest, 'fixture-app'))
        .toThrow('资产 id 必须唯一');
});

test('资产文件名重复时拒绝发布清单', () => {
    const firstAsset = validManifest.assets[0];
    const invalidManifest = {
        ...validManifest,
        assets: [
            firstAsset,
            {
                ...firstAsset,
                id: 'windows-arm64-portable',
                architecture: 'arm64',
                url: 'https://example.com/downloads/fixture-app-arm64.zip',
            },
        ],
    };

    expect(() => parseReleaseManifest(invalidManifest, 'fixture-app'))
        .toThrow('资产 filename 必须唯一');
});

test('资产 URL 重复时拒绝发布清单', () => {
    const firstAsset = validManifest.assets[0];
    const invalidManifest = {
        ...validManifest,
        assets: [
            firstAsset,
            {
                ...firstAsset,
                id: 'windows-arm64-portable',
                architecture: 'arm64',
                filename: 'fixture-app-1.2.3-windows-arm64.zip',
            },
        ],
    };

    expect(() => parseReleaseManifest(invalidManifest, 'fixture-app'))
        .toThrow('资产 url 必须唯一');
});

test('productId 与当前作品不一致时拒绝发布清单', () => {
    const invalidManifest = {
        ...validManifest,
        productId: 'test-app',
    };

    expect(() => parseReleaseManifest(invalidManifest, 'fixture-app'))
        .toThrow('productId 必须与当前作品一致');
});

test('拒绝非 HTTPS 发布清单地址', async () => {
    await expect(
        fetchReleaseManifest(
            'http://example.com/stable.json',
            'fixture-app',
        ),
    ).rejects.toThrow('发布清单 URL 必须使用 HTTPS');
});

test('拒绝非成功 HTTP 状态', async () => {
    const fetchImpl: typeof globalThis.fetch = async () =>
        new Response(null, { status: 503 });

    await expect(
        fetchReleaseManifest(
            'https://example.com/stable.json',
            'fixture-app',
            fetchImpl,
        ),
    ).rejects.toThrow('发布清单请求失败：HTTP 503');
});

test('拒绝声明大小超过上限的响应', async () => {
    const fetchImpl: typeof globalThis.fetch = async () =>
        new Response(null, {
            status: 200,
            headers: {
                'Content-Length': '262145',
            },
        });

    await expect(
        fetchReleaseManifest(
            'https://example.com/stable.json',
            'fixture-app',
            fetchImpl,
        ),
    ).rejects.toThrow('发布清单响应超过 256 KiB');
});

test('拒绝实际大小超过上限的响应', async () => {
    const oversizedBody = 'a'.repeat(262_145);
    const fetchImpl: typeof globalThis.fetch = async () =>
        new Response(oversizedBody, { status: 200 });

    await expect(
        fetchReleaseManifest(
            'https://example.com/stable.json',
            'fixture-app',
            fetchImpl,
        ),
    ).rejects.toThrow('发布清单响应超过 256 KiB');
});

test('获取并解析有效的远程发布清单', async () => {
    const fetchImpl: typeof globalThis.fetch = async () =>
        new Response(JSON.stringify(validManifest), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    const manifest = await fetchReleaseManifest(
        'https://example.com/stable.json',
        'fixture-app',
        fetchImpl,
    );

    expect(manifest.productId).toBe('fixture-app');
    expect(manifest.version).toBe('1.2.3');
});

test('拒绝无效 JSON 响应', async () => {
    const fetchImpl: typeof globalThis.fetch = async () =>
        new Response('{ invalid json', { status: 200 });

    await expect(
        fetchReleaseManifest(
            'https://example.com/stable.json',
            'fixture-app',
            fetchImpl,
        ),
    ).rejects.toThrow('发布清单不是有效 JSON');
});

test('拒绝空发布清单响应体', async () => {
    const fetchImpl: typeof globalThis.fetch = async () =>
        new Response(null, { status: 200 });

    await expect(
        fetchReleaseManifest(
            'https://example.com/stable.json',
            'fixture-app',
            fetchImpl,
        ),
    ).rejects.toThrow('发布清单响应体为空');
});

test('没有清单来源时返回空 Map', async () => {
    const manifests = await fetchReleaseManifests([]);

    expect(manifests).toBeInstanceOf(Map);
    expect(manifests.size).toBe(0);
})

test('按作品 ID 聚合远程发布清单', async () => {
    const fetchImpl: typeof globalThis.fetch = async () =>
        new Response(JSON.stringify(validManifest), {
            status: 200,
        });

    const manifests = await fetchReleaseManifests(
        [
            {
                productId: 'fixture-app',
                url: 'https://example.com/stable.json',
            },
        ],
        fetchImpl,
    );

    expect(manifests.size).toBe(1);
    expect(manifests.get('fixture-app')?.version).toBe('1.2.3');
});