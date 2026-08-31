import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    reporter: process.env.CI
        ? [
            ['dot'],
            [
                'html',
                {
                    outputFolder: 'playwright-report',
                    open: 'never',
                },
            ],
        ]
        : [['list']],
    webServer: {
        command: 'npm run preview',
        url: 'http://localhost:4321',
        reuseExistingServer: !process.env.CI,
    },
    use: {
        baseURL: 'http://localhost:4321',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
});

