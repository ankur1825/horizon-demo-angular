const { test, expect } = require('@playwright/test');

test.describe('QA signoff workflow', () => {
  test('loads the deployed Angular QA dashboard', async ({ page, baseURL }) => {
    const consoleErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.goto(baseURL || '/');

    await expect(page.getByRole('heading', { name: /release evidence/i })).toBeVisible();
    await expect(page.getByTestId('qa-status')).toHaveText('Healthy');
    await expect(page.getByTestId('release-version')).toHaveText('release-2026.05');
    await expect(page.getByText('Unit tests passed')).toBeVisible();
    await expect(page.getByText('Policy checks passed')).toBeVisible();

    expect(consoleErrors, `Browser console errors for ${baseURL}`).toEqual([]);
  });

  test('submits a QA signoff request', async ({ page, baseURL }) => {
    await page.goto(baseURL || '/');

    await page.getByTestId('requester-input').fill('qa.engineer@client.example');
    await page.getByTestId('suite-select').selectOption('Regression');
    await page.getByTestId('submit-signoff').click();

    await expect(page.getByTestId('success-message')).toContainText('QA signoff request submitted');
    await expect(page.getByTestId('success-message')).toContainText('Regression');
  });
});
