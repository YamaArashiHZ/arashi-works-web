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

test('可以从作品列表进入 PixBox 详情页', async ({ page }) => {
    await page.goto('/works/');

    await page.getByRole('link', { name: 'PixBox' }).click();

    await expect(page).toHaveURL('/works/pixbox/');
    await expect(
        page.getByRole('heading', { level: 1 }),
    ).toHaveText('PixBox');
    await expect(
        page.getByRole('heading', { name: '作品介绍' }),
    ).toBeVisible();
    await expect(
        page.getByRole('link', { name: '返回作品列表' }),
    ).toHaveAttribute('href', '/works/');
});

test('模组作品显示正确类型和关联手记', async ({ page }) => {
    await page.goto('/works/ftb-solo-quests/');

    await expect(
        page.getByRole('heading', {
            level: 1,
            name: 'FTB Solo Quests',
        }),
    ).toBeVisible();

    await expect(page.locator('main h1')).toHaveCount(1);

    const workMetadata = page.locator('.work-meta');

    await expect(
        workMetadata.getByText('模组', { exact: true }),
    ).toBeVisible();

    const relatedNote = page.getByRole('link', {
        name: 'FTB Solo Quests v1.1.2 开发日志',
    });

    await expect(relatedNote).toHaveAttribute(
        'href',
        '/notes/ftb-solo-quests-devlog/',
    );

    await relatedNote.click();

    await expect(page).toHaveURL(
        '/notes/ftb-solo-quests-devlog/',
    );
    await expect(page.locator('main h1')).toHaveCount(1);
});