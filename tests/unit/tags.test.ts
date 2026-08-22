import { expect, test } from "vitest";
import { countContentByTag } from "../../src/lib/tags";

test("统计多个内容集合中的指定标签", () => {
    const works = [
        { data: { tags: ["utility"] as const } },
        { data: { tags: ["astro", "utility"] as const } },
    ];
    const notes = [
        { data: { tags: ["utility"] as const } },
        { data: { tags: ["astro"] as const } },
    ];

    expect(countContentByTag("utility", [works, notes])).toBe(3);
    expect(countContentByTag("astro", [works, notes])).toBe(2);
});

test("没有匹配内容时返回0", () => {
    const content = [
        { data: { tags: ["utility"] as const } },
    ];

    expect(countContentByTag("schema-test", [content])).toBe(0);
});

test("空集合返回0", () => {
    expect(countContentByTag("utility", [])).toBe(0);
});