import { expect, test } from "vitest";
import { countContentByTag } from "../../src/lib/tags";

test("统计多个内容几何中的指定标签", () => {
    const works = [
        { data: { tags: ["tools"] as const } },
        { data: { tags: ["astro", "tools"] as const } },
    ];
    const notes = [
        { data: { tags: ["tools"] as const } },
        { data: { tags: ["astro"] as const } },
    ];

    expect(countContentByTag("tools", [works, notes])).toBe(3);
    expect(countContentByTag("astro", [works, notes])).toBe(2);
});

test("没有匹配内容时返回0", () => {
    const content = [
        { data: { tags: ["tools"] as const } },
    ];

    expect(countContentByTag("schema-test", [content])).toBe(0);
});

test("空集合返回0", () => {
    expect(countContentByTag("tools", [])).toBe(0);
});