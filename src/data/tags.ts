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
    'astrbot': {
        name: 'AstrBot',
        description: 'Astrbot 插件'
    },
    'ai': {
        name: 'AI',
        description: 'AI使用与生成',
    },
    'game': {
        name: '游戏',
        description: '游戏设计、开发与模组'
    },
} satisfies Record<string, TagDefinition>;

export type TagSlug = keyof typeof tags;