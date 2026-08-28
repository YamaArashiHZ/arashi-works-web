import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedNotes } from '../lib/content';
import { site as siteData } from '../data/site';

export async function GET({ site }: APIContext) {
    if (!site) {
        throw new Error('生成 RSS 前必须在 Astro 配置中设置 site');
    }

    const notes = await getPublishedNotes();

    return rss({
        title: `${siteData.name} 异造手记`,
        description: `Arashi Works 的开发日志、技术笔记与创作记录`,
        site,
        items: notes.map((note) => ({
            title: note.data.title,
            description: note.data.summary,
            pubDate: note.data.publishedAt,
            link: `/notes/${note.id}/`,
        })),
        customData: '<language>zh-CN</language>',
    });
}