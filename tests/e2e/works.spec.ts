import { expect, test } from '@playwright/test';

test('作品页标记正确的当前导航项', async ({ page }) => {
    await page.goto('/works/');

    const navigation = page.getByRole('navigation', {
        name: '主导航',
    });

    const worksLink = navigation.getByRole('link', {
        name: '作品',
    });

    const homeLink = navigation.getByRole('link', {
        name: '首页',
    });

    await expect(worksLink).toHaveAttribute('aria-current', 'page');
    await expect(homeLink).not.toHaveAttribute('aria-current', 'page');
});