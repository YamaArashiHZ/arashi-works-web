import { expect, test } from '@playwright/test';

test('隐私页准确说明当前与计划中的数据处理', async ({ page }) => {
    await page.goto('/privacy/');

    await expect(page).toHaveTitle(
        '隐私说明 | Arashi Works',
    );

    const main = page.locator('main');

    await expect(
        main.getByRole('heading', {
            level: 1,
            name: '隐私说明',
        }),
    ).toBeVisible();

    await expect(main.locator('h1')).toHaveCount(1);

    const currentProcessing = main.getByRole('region', {
        name: '当前的数据处理',
    });

    await expect(currentProcessing).toContainText(
        '尚未开放评论与角色聊天功能',
    );
    await expect(currentProcessing).toContainText(
        '不会将搜索关键词发送给 Arashi Works 服务器',
    );

    const plannedComments = main.getByRole('region', {
        name: '计划中的评论功能',
    });

    await expect(plannedComments).toContainText('Waline');
    await expect(plannedComments).toContainText(
        '该功能正式开放前',
    );

    const futureChat = main.getByRole('region', {
        name: '未来角色聊天',
    });

    await expect(futureChat).toContainText(
        '角色聊天目前尚未开放',
    );
});