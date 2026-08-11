import { expect, test } from '@playwright/test';

test('首页显示正确的品牌信息', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Arashi Works');
    await expect(
        page.getByRole('heading', { level: 1 })
    ).toHaveText('Arashi Works');
});