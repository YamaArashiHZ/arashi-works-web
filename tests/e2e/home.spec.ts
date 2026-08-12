import { expect, test } from '@playwright/test';

test('首页显示正确的品牌信息', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Arashi Works');
    await expect(
        page.getByRole('heading', { level: 1 })
    ).toHaveText('Arashi Works');

    const mainNavigation = page.getByRole('navigation', {
        name: '主导航',
    });

    await expect(mainNavigation).toBeVisible();

    const homeLink = mainNavigation.getByRole('link', {
        name: '首页',
    });

    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute('aria-current', 'page');

    const footer = page.getByRole('contentinfo');

    await expect(footer).toContainText('Arashi Works');
    await expect(footer).toContainText('山嵐异造坊');

    const footerNavigation = page.getByRole('navigation', {
        name: '页脚导航',
    });

    await expect(
        footerNavigation.getByRole('link', {
            name: '隐私说明',
        }),
    ).toHaveAttribute('href', '/privacy/');
});