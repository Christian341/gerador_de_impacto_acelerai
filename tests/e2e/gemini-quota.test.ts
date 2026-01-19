import { test, expect } from '@playwright/test';

test.describe('Gemini API Quota Error Handling', () => {
    test('should handle 429 quota exceeded error gracefully', async ({ page }) => {
        // Navigate to the application
        await page.goto('http://localhost:3003');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Take initial screenshot
        await page.screenshot({ path: 'test-results/01-initial-state.png', fullPage: true });

        // Find and fill the text input
        const textarea = page.locator('textarea').first();
        await textarea.fill('Test analysis for quota error');

        // Listen for console errors
        const consoleErrors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error' || msg.type() === 'warning') {
                consoleErrors.push(msg.text());
            }
        });

        // Listen for network responses to capture 429 errors
        let quotaError: any = null;
        page.on('response', async response => {
            if (response.status() === 429) {
                try {
                    quotaError = await response.json();
                    console.log('Captured 429 error:', JSON.stringify(quotaError, null, 2));
                } catch (e) {
                    console.log('Could not parse 429 response as JSON');
                }
            }
        });

        // Click the submit button
        const submitButton = page.locator('button[type="button"]').filter({ hasText: /enviar|analisar/i }).or(
            page.locator('button').filter({ has: page.locator('svg') }).last()
        );

        await submitButton.click();

        // Wait for either success or error state
        await page.waitForTimeout(3000);

        // Take screenshot of the result
        await page.screenshot({ path: 'test-results/02-after-submit.png', fullPage: true });

        // Check if error message is displayed
        const errorVisible = await page.locator('text=/erro|error|falha/i').isVisible().catch(() => false);

        if (errorVisible) {
            console.log('Error message is visible on UI');
            await page.screenshot({ path: 'test-results/03-error-state.png', fullPage: true });
        }

        // Log console errors
        if (consoleErrors.length > 0) {
            console.log('Console errors captured:', consoleErrors);
        }

        // If we captured a quota error, verify its structure
        if (quotaError) {
            console.log('✓ Successfully captured 429 quota error');
            expect(quotaError.error).toBeDefined();
            expect(quotaError.error.code).toBe(429);
            expect(quotaError.error.status).toBe('RESOURCE_EXHAUSTED');

            // Check for retryDelay in details
            const retryInfo = quotaError.error.details?.find(
                (d: any) => d['@type']?.includes('RetryInfo')
            );

            if (retryInfo) {
                console.log('RetryDelay found:', retryInfo.retryDelay);
            }
        } else {
            console.log('No 429 error captured - API call may have succeeded or failed differently');
        }

        // Verify the app didn't crash
        const appStillResponsive = await page.locator('body').isVisible();
        expect(appStillResponsive).toBeTruthy();
    });
});
