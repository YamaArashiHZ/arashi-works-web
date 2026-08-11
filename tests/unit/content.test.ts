import { expect, test } from 'vitest';
import { isPublished } from '../../src/lib/content';

test('非草稿且发布时间早于当前时间时公开', () => {
    const now = new Date('2026-08-11T10:00:00+08:00');
    const data = {
        draft: false,
        publishedAt: new Date('2026-08-11T09:00:00+08:00'),
    };

    expect(isPublished(data, now)).toBe(true);
});

test('草稿不公开', () => {
    const now = new Date('2026-08-11T10:00:00+08:00');
    const data = {
        draft: true,
        publishedAt: new Date('2026-08-11T09:00:00+08:00'),
    };

    expect(isPublished(data, now)).toBe(false);
});

test('未来发布内容不公开', () => {
    const now = new Date('2026-08-11T10:00:00+08:00');
    const data = {
        draft: false,
        publishedAt: new Date('2026-08-11T11:00:00+08:00'),
    };

    expect(isPublished(data, now)).toBe(false);
});

test('缺少发布时间不公开', () => {
    const now = new Date('2026-08-11T10:00:00+08:00');
    const data = {
        draft: false,
    };

    expect(isPublished(data, now)).toBe(false);
});

test('发布时间等于当前时间时公开', () => {
    const now = new Date('2026-08-11T10:00:00+08:00');
    const data = {
        draft: false,
        publishedAt: new Date('2026-08-11T10:00:00+08:00'),
    };

    expect(isPublished(data, now)).toBe(true);
});