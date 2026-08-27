import { expect, test } from "@playwright/test";

test('标签总览只显示具有公开内容的标签', async ({ page }) => {
    await page.goto('/tags/');

    await expect(
        page.getByRole('heading', {
            level: 1,
            name: '标签总览',
        }),
    ).toBeVisible();

    await expect(
        page.getByRole('link', {
            name: '实用工具',
            exact: true,
        }),
    ).toHaveAttribute('href', '/search/?tag=utility');

    await expect(
        page.getByText('0 项公开内容', {
            exact: true,
        }),
    ).toHaveCount(0);

    await expect(
        page.getByRole('heading', {
            level: 2,
            name: 'Schema Test',
        }),
    ).toHaveCount(0);

    await expect(
        page.getByRole('link', {
            name: '前往搜索',
        }),
    ).toHaveAttribute('href', '/search/');
});