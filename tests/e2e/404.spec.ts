import { expect, test } from '@playwright/test';

test('未知路径返回自定义404页面并禁止索引', async ({ page }) => {
    const response = await page.goto(
        '/this-page-does-not-exist/',
    );

    expect(response).not.toBeNull();
    expect(response?.status()).toBe(404);

    await expect(page).toHaveTitle(
        '未找到页面 | Arashi Works',
    );

    const main = page.locator('main');

    await expect(main.locator('h1')).toHaveCount(1);

    await expect(
        main.getByRole('heading', {
            level: 1,
            name: '这份异造档案似乎不在这里',
        }),
    ).toBeVisible();

    await expect(
        page.locator('meta[name="robots"]'),
    ).toHaveAttribute(
        'content',
        'noindex, nofollow',
    );

    await expect(
        main.locator('.error-code'),
    ).toHaveAttribute('aria-hidden', 'true');

    const errorNavigation = main.getByRole('navigation', {
        name: '错误页面导航',
    });

    await expect(
        errorNavigation.getByRole('link', {
            name: '返回首页',
        }),
    ).toHaveAttribute('href', '/');

    await expect(
        errorNavigation.getByRole('link', {
            name: '浏览作品',
        }),
    ).toHaveAttribute('href', '/works/');

    await expect(
        errorNavigation.getByRole('link', {
            name: '浏览手记',
        }),
    ).toHaveAttribute('href', '/notes/');

    await expect(
        errorNavigation.getByRole('link', {
            name: '搜索网站',
        }),
    ).toHaveAttribute('href', '/search/');
});