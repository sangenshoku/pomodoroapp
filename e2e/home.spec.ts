import { test, expect } from '@playwright/test';

test.describe.skip('Home', () => {
  test('visits the app root url', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="pomodoro-timer"] .time')).toHaveText('25:00');
    await expect(page.locator('[data-testid="pomodoro-timer"] .btn-toggle-start')).toBeVisible();
  });

  test('starts the timer', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="pomodoro-timer"] .btn-toggle-start').click();
    await expect(page.locator('[data-testid="pomodoro-timer"] .time')).toHaveText('24:59');
    await expect(page.locator('[data-testid="pomodoro-timer"] .btn-toggle-start')).toHaveText(
      'Pause'
    );
  });

  test('pauses the timer', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="pomodoro-timer"] .btn-toggle-start').click();
    await expect(page.locator('[data-testid="pomodoro-timer"] .time')).toHaveText('25:00');
    await expect(page.locator('[data-testid="pomodoro-timer"] .btn-toggle-start')).toHaveText(
      'Pause'
    );
    await expect(page.locator('[data-testid="pomodoro-timer"] .time')).toHaveText('24:59');

    await page.locator('[data-testid="pomodoro-timer"] .btn-toggle-start').click();

    await expect(page.locator('[data-testid="pomodoro-timer"] .time')).toHaveText('24:59');

    await expect(page.locator('[data-testid="pomodoro-timer"] .btn-toggle-start')).toHaveText(
      'Start'
    );

    await page.locator('[data-testid="pomodoro-timer"] .btn-toggle-start').click();

    await expect(page.locator('[data-testid="pomodoro-timer"] .time')).toHaveText('24:58');
  });

  test('stops the timer', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="pomodoro-timer"] .btn-toggle-start').click();
    await expect(page.locator('[data-testid="pomodoro-timer"] .time')).toHaveText('24:59');

    await page.locator('[data-testid="pomodoro-timer"] .btn-stop').click();

    await expect(page.locator('[data-testid="pomodoro-timer"] .time')).toHaveText('25:00');
  });
});
