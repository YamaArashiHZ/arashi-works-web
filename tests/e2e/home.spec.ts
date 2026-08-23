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

test('首页辅助侧栏提供角色、标签和归档入口', async ({ page }) => {
    await page.goto('/');

    const sidebar = page.getByRole('complementary', {
        name: '首页辅助信息',
    });

    await expect(sidebar).toBeVisible();

    await expect(
        sidebar.getByRole('img', {
            name: '山雾铃头像',
        }),
    ).toBeVisible();

    await expect(
        sidebar.getByRole('link', {
            name: '查看角色资料',
        }),
    ).toHaveAttribute('href', '/about/yamagiri-rin/');

    await expect(
        sidebar.getByRole('link', {
            name: /实用工具/,
        }),
    ).toHaveAttribute('href', '/search/?tag=utility');

    await expect(
        sidebar.getByRole('link', {
            name: '查看全部标签',
        }),
    ).toHaveAttribute('href', '/tags/');

    const archiveLinks = sidebar
        .locator('.home-archive-summary')
        .getByRole('link');

    await expect(archiveLinks.first()).toHaveAttribute(
        'href',
        /^\/notes\/archive\/#archive-month-\d{4}-(?:[1-9]|1[0-2])$/,
    );

    await expect(
        sidebar.getByRole('link', {
            name: '查看全部归档',
        }),
    ).toHaveAttribute('href', '/notes/archive/');
});