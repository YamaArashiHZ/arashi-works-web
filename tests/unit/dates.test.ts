import { expect, test } from "vitest";
import { getYearMonth } from "../../src/lib/dates";

test("按上海时区提取年份和月份", () => {
    const date = new Date("2026-07-31T16:30:00Z");

    expect(getYearMonth(date)).toEqual({
        year: "2026",
        month: "8"
    });
});

test("上海时区年份临界点", () => {
    const date = new Date("2026-12-31T16:30:00Z");

    expect(getYearMonth(date)).toEqual({
        year: "2027",
        month: "1",
    });
});