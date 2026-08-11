import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { tags } from './data/tags';
import { noteCategorySlugs } from './data/categories';

const contentDateTime = z.iso
    .datetime({ offset: true, precision: 0 })
    .transform((value) => new Date(value));

const tagSlug = z.string().refine(
    (value) => Object.hasOwn(tags, value),
    { message: '标签未登记' }
);

const works = defineCollection({
    loader: glob({
        base: './src/content/works',
        pattern: '**/index.md',
    }),
    schema: ({ image }) => z.object({
        title: z.string(),
        summary: z.string(),
        type: z.enum(['software', 'game', 'experiment']),
        status: z.enum([
            'in-development',
            'released',
            'maintained',
            'paused',
            'archived',
        ]),
        draft: z.boolean(),
        publishedAt: contentDateTime.optional(),
        updatedAt: contentDateTime.optional(),
        tags: z.array(tagSlug),
        platforms: z.array(z.enum([
            'web',
            'windows',
            'linux',
            'android',
        ])),
        featured: z.boolean().optional(),
        repositoryUrl: z.url().optional(),
        homepageUrl: z.url().optional(),
        releaseManifestUrl: z.url().optional(),
        feedbackUrl: z.url().optional(),
        license: z.string().optional(),
        cover: image().optional(),
        screenshots: z.array(image()).optional(),
    }).superRefine((data, ctx) => {
        if (data.draft === false && data.cover === undefined) {
            ctx.addIssue({
                code: 'custom',
                path: ['cover'],
                message: '公开作品必须提供封面',
            });
        }
        if (data.draft === false && data.publishedAt === undefined) {
            ctx.addIssue({
                code: 'custom',
                path: ['publishedAt'],
                message: '公开作品必须提供发布时间',
            });
        }
    }),
});

const notes = defineCollection({
    loader: glob({
        base: './src/content/notes',
        pattern: '**/index.md',
    }),
    schema: ({ image }) => z.object({
        title: z.string(),
        summary: z.string(),
        draft: z.boolean(),
        category: z.enum(noteCategorySlugs),
        publishedAt: contentDateTime.optional(),
        updatedAt: contentDateTime.optional(),
        tags: z.array(tagSlug),
        featured: z.boolean().optional(),
        description: z.string().optional(),
        cover: image().optional(),
        work: reference('works').optional(),
    }).superRefine((data, ctx) => {
        if (data.draft === false && data.publishedAt === undefined) {
            ctx.addIssue({
                code: 'custom',
                path: ['publishedAt'],
                message: '公开手记必须提供发布时间',
            });
        }
    }),
});

export const collections = { works, notes };