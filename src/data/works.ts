export const workTypeLabels = {
    software: '软件',
    game: '游戏',
    mod: '模组',
    plugin: '插件',
    experiment: '实验',
} as const;

export const workStatusLabels = {
    'in-development': '开发中',
    released: '已发布',
    maintained: '维护中',
    paused: '暂停',
    archived: '已归档',
} as const;

export const workPlatformLabels = {
    web: '网页',
    windows: 'Windows',
    linux: 'Linux',
    android: 'Android',
} as const;

export type WorkType = keyof typeof workTypeLabels;
export type WorkStatus = keyof typeof workStatusLabels;
export type WorkPlatform = keyof typeof workPlatformLabels;