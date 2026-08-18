import type { TagSlug } from "../data/tags";

interface TaggedContent {
    data: {
        tags: readonly TagSlug[];
    };
}

export function countContentByTag(
    tag: TagSlug,
    collections: readonly (readonly TaggedContent[])[],
) {
    return collections.reduce(
        (total, collection) =>
            total + collection.filter((entry) =>
                entry.data.tags.includes(tag)
            ).length,
        0,
    );
}