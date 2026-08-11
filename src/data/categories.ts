export const noteCategorySlugs = [
    'devlog',
    'technical',
    'making-of',
    'misc',
] as const;

interface CategoryDefinition {
    name: string;
    description: string;
}

export type NoteCategorySlug = typeof noteCategorySlugs[number];

export const noteCategories: Record<NoteCategorySlug, CategoryDefinition> = {
    'devlog': {
        name: '开发记录',
        description: '软件和游戏的阶段进度、设计过程与复盘',
    },
    'technical': {
        name: '技术笔记',
        description: '编程、工具、部署和问题解决记录',
    },
    'making-of': {
        name: '制作杂谈',
        description: '美术、音乐、叙事、交互和创作过程',
    },
    'misc': {
        name: '社内杂记',
        description: '难以归类但值得保留的短文与随笔',
    },
};