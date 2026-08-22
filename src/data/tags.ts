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
    'minecraft': {
        name: 'Minecraft',
        description: '我的世界相关内容',
    },
    'utility': {
        name: '实用工具',
        description: '提升效率、实用性或日常便利的工具',
    },
} satisfies Record<string, TagDefinition>;

export type TagSlug = keyof typeof tags;