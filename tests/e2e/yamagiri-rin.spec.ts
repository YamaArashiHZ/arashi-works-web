import { expect, test } from "@playwright/test";

test('角色页明确显示聊天筹备状态且没有聊天交互', async ({ page }) => {
    const modelRequests: string[] = [];

    page.on('request', (request) => {
        const resourceType = request.resourceType();
        const requestUrl = new URL(request.url());

        const isApiRequest =
            resourceType === 'fetch' ||
            resourceType === 'xhr';

        const isModelHost =
            /(^|\.)api\.deepseek\.com$/i.test(requestUrl.hostname) ||
            /(^|\.)api\.openai\.com$/i.test(requestUrl.hostname);

        const isChatPath =
            /\/chat\/completions(?:\/|$)/i.test(requestUrl.pathname) ||
            /\/api\/chat(?:\/|$)/i.test(requestUrl.pathname);

        if (isApiRequest && (isModelHost || isChatPath)) {
            modelRequests.push(request.url());
        }
    });

    await page.goto('/about/yamagiri-rin/');

    const main = page.locator('main');

    await expect(
        main.getByRole('heading', {
            level: 1,
            name: '山雾铃',
        }),
    ).toBeVisible();

    const preparation = main.getByRole('region', {
        name: '异造坊导览对话',
    });

    await expect(preparation).toBeVisible();
    await expect(preparation).toContainText('筹备中');
    await expect(preparation).toContainText('当前不会发送消息或连接任何模型服务');
    await expect(preparation).toContainText('正式开放前将另行完成隐私、安全、内容边界和成本专项评估');

    await expect(preparation.getByRole('textbox')).toHaveCount(0);
    await expect(preparation.getByRole('button')).toHaveCount(0);

    expect(modelRequests).toEqual([]);
});