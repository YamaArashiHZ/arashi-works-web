import { expect, test } from '@playwright/test';

test('可以通过年月锚点直接访问手机归档分组', async ({ page }) => {
    await page.goto(
        '/notes/archive/#archive-month-2026-8',
    );

    await expect(page).toHaveURL(
        /\/notes\/archive\/#archive-month-2026-8$/,
    );

    const monthSection = page.locator(
        'section[aria-labelledby="archive-month-2026-8"]',
    );

    await expect(monthSection).toBeVisible();

    const monthHeading = monthSection.getByRole('heading', {
        level: 3,
        name: '8 月',
    });

    await expect(monthHeading).toHaveAttribute(
        'id',
        'archive-month-2026-8',
    );
    await expect(monthHeading).toBeInViewport();
})