import { getCollection } from 'astro:content';
import type { NoteCategorySlug } from '../data/categories';
import type { TagSlug } from '../data/tags';
import { fetchReleaseManifests } from './manifests';

interface PublishableDate {
    draft: boolean;
    publishedAt?: Date;
}

export function isPublished<T extends PublishableDate>(
    data: T,
    now = new Date(),
): data is T & { publishedAt: Date } {
    return !data.draft
        && data.publishedAt !== undefined
        && data.publishedAt.getTime() <= now.getTime();
}

export async function getPublishedWorks(now = new Date()) {
    const works = await getCollection('works');

    return works.filter((entry): entry is typeof entry & {
        data: typeof entry.data & { publishedAt: Date };
    } => 
        isPublished(entry.data, now)
    ).sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export async function getPublishedNotes(now = new Date()) {
    const notes = await getCollection('notes');

    return notes.filter((entry): entry is typeof entry & {
        data: typeof entry.data & { publishedAt: Date };
    } => 
        isPublished(entry.data, now)
    ).sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export async function getPublishedNotesByWork(
    workId: string,
    now = new Date(),
) {
    const publishedNotes = await getPublishedNotes(now);

    return publishedNotes.filter(({ data }) =>
        data.work?.id === workId
    );
}

export async function getPublishedContentByTag(
    tag: TagSlug,
    now = new Date(),
) {
    const [works, notes] = await Promise.all([
        getPublishedWorks(now),
        getPublishedNotes(now),
    ]);

    return {
        works: works.filter(({ data }) => data.tags.includes(tag)),
        notes: notes.filter(({ data }) => data.tags.includes(tag)),
    };
}

export async function getPublishedNotesByCategory(
    category: NoteCategorySlug,
    now = new Date(),
) {
    const notes = await getPublishedNotes(now);

    return notes.filter(({ data }) => data.category === category);
}

export async function getPublishedWorkManifests(
    now = new Date(),
    fetchImpl: typeof globalThis.fetch = globalThis.fetch,
) {
    const works = await getPublishedWorks(now);

    const sources = works.flatMap((work) => {
        const url = work.data.releaseManifestUrl;

        if (url === undefined) {
            return [];
        }

        return [{
            productId: work.id,
            url,
        }];
    });

    return fetchReleaseManifests(sources, fetchImpl);
}