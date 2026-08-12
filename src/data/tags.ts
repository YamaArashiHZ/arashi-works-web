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
    'tools': {
        name: '工具',
        description: '日常便利软件、程序与相关内容',
    },
} satisfies Record<string, TagDefinition>;

export type TagSlug = keyof typeof tags;