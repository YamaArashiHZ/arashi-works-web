import { expect, test } from "@playwright/test";

test("主题选择在刷新后保持", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    const root = page.locator("html");
    const darkThemeToggle = page.getByRole("button", {
        name: "切换到深色模式",
    });

    await expect(root).not.toHaveAttribute("data-theme");
    await expect(darkThemeToggle).toBeVisible();

    await darkThemeToggle.click();

    await expect(root).toHaveAttribute("data-theme", "dark");
    await expect(
        page.getByRole("button", {
            name: "切换到浅色模式",
        }),
    ).toBeVisible();

    await page.reload();

    await expect(root).toHaveAttribute("data-theme", "dark");
    await expect(
        page.getByRole("button", {
            name: "切换到浅色模式",
        }),
    ).toBeVisible();
});

test("键盘可以切换主题", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    const root = page.locator("html");
    const darkThemeToggle = page.getByRole("button", {
        name: "切换到深色模式",
    });

    await darkThemeToggle.focus();
    await expect(darkThemeToggle).toBeFocused();

    await darkThemeToggle.press("Enter");

    await expect(root).toHaveAttribute("data-theme", "dark");

    const lightThemeToggle = page.getByRole("button", {
        name: "切换到浅色模式",
    });

    await expect(lightThemeToggle).toBeFocused();

    await lightThemeToggle.press("Space");

    await expect(root).toHaveAttribute("data-theme", "light");
    await expect(
        page.getByRole("button", {
            name: "切换到深色模式",
        }),
    ).toBeFocused();
});

test("本地存储不可用时主题功能安全降级", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });

    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => {
        pageErrors.push(error);
    });

    await page.addInitScript(() => {
        const storageKey = "arashi-works-theme";
        const originalGetItem = Storage.prototype.getItem;
        const originalSetItem = Storage.prototype.setItem;

        Storage.prototype.getItem = function (key) {
            if (this === window.localStorage && key === storageKey) {
                throw new DOMException(
                    "localStorage unavailable",
                    "SecurityError",
                );
            }

            return originalGetItem.call(this, key);
        };

        Storage.prototype.setItem = function (key, value) {
            if (this === window.localStorage && key === storageKey) {
                throw new DOMException(
                    "localStorage unavailable",
                    "SecurityError",
                );
            }

            originalSetItem.call(this, key, value);
        };
    });

    await page.goto("/");

    const root = page.locator("html");
    const darkThemeToggle = page.getByRole("button", {
        name: "切换到深色模式",
    });

    await expect(root).not.toHaveAttribute("data-theme");
    await expect(darkThemeToggle).toBeVisible();

    await darkThemeToggle.click();

    await expect(root).toHaveAttribute("data-theme", "dark");
    await expect(
        page.getByRole("button", {
            name: "切换到浅色模式",
        }),
    ).toBeVisible();

    await page.reload();

    await expect(root).not.toHaveAttribute("data-theme");
    await expect(
        page.getByRole("button", {
            name: "切换到深色模式",
        }),
    ).toBeVisible();
    expect(pageErrors).toEqual([]);
});

test.describe("禁用 JavaScript", () => {
    test.use({
        javaScriptEnabled: false,
        colorScheme: "dark",
    });

    test("页面仍跟随系统暗色主题", async ({ page }) => {
        await page.goto("/");

        await expect(page.locator("html")).toHaveCSS(
            "color-scheme",
            "dark",
        );
        await expect(page.locator(".theme-toggle")).toBeHidden();
        await expect(
            page.getByRole("heading", {
                level: 1,
                name: "Arashi Works",
            }),
        ).toBeVisible();
    });
});