import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const works = defineCollection({
    loader: glob({
        base: './src/content/works',
        pattern: '**/index.md',
    }),
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        type: z.enum(['software', 'game', 'experiment']),
        status: z.enum([
            'in-development',
            'released',
            'maintained',
            'paused',
            'archived',
        ])
    }),
});

export const collections = { works };