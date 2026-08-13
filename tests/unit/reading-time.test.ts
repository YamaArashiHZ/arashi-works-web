import { expect, test } from "vitest";
import { estimateReadingMinutes } from "../../src/lib/reading-time";

test('空内容阅读时间至少为1分钟', () => {
    expect(estimateReadingMinutes('')).toBe(1);
});

test('按照每分钟500汉字估算阅读时间', () => {
    expect(estimateReadingMinutes('中'.repeat(500))).toBe(1);
    expect(estimateReadingMinutes('中'.repeat(501))).toBe(2);
});

test('按照每分钟200单词估算阅读时间', () => {
    expect(estimateReadingMinutes(Array(200).fill('word').join(' '))).toBe(1)
    expect(estimateReadingMinutes(Array(201).fill('word').join(' '))).toBe(2)
});

test('分别计算中英文后合并阅读时间', () => {
    const text = [
        '中'.repeat(500),
        Array(200).fill('word').join(' '),
    ].join('\n');

    expect(estimateReadingMinutes(text)).toBe(2);
})