interface TagDefinition {
    name: string;
    description?: string;
}

export const tags = {
    'astro': {
        name: 'Astro',
        description: 'Astro 网站开发相关内容',
    },
    'schema-test': {
        name: 'Schema Test',
    },
} satisfies Record<string, TagDefinition>;

export type TagSlug = keyof typeof tags;