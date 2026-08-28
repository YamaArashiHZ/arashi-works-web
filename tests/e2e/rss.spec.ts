import { expect, test } from '@playwright/test';

test('网站提供可发现的异造手记RSS订阅源', async ({
    page,
    request,
}) => {
    const response = await request.get('/rss.xml');

    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];

    expect(contentType).toContain('xml');

    const xml = await response.text();

    expect(xml).toContain(
        '<title>Arashi Works 异造手记</title>',
    );
    expect(xml).toContain('<language>zh-CN</language>');
    expect(xml).toContain(
        'https://www.arashiworks.com/notes/',
    );
    expect(xml).not.toContain('localhost');
    expect(xml).not.toContain('127.0.0.1');
    expect(xml).not.toContain('Schema Test');

    await page.goto('/');

    await expect(
        page.locator(
            'link[rel="alternate"][type="application/rss+xml"]',
        ),
    ).toHaveAttribute(
        'href',
        'https://www.arashiworks.com/rss.xml',
    );

    const footerNavigation = page.getByRole('navigation', {
        name: '页脚导航',
    });

    await expect(
        footerNavigation.getByRole('link', {
            name: 'RSS 订阅',
        }),
    ).toHaveAttribute('href', '/rss.xml');
});