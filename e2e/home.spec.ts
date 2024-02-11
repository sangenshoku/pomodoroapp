import { test, expect, Locator } from '@playwright/test';

let startButton: Locator;
let time: Locator;

test.describe('Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    startButton = page.locator('[data-testid="pomodoro-timer"] .btn-toggle-start');
    time = page.locator('[data-testid="pomodoro-timer"] .time');
  });

  test('visits the app root url', async () => {
    await expect(time).toHaveText('25:00');
    await expect(startButton).toBeVisible();
  });

  test('starts the timer', async ({ page }) => {
    await startButton.click();
    await expect(time).toHaveText('24:59');
    await expect(startButton).toHaveText('Pause');

    await expect(page.locator('[data-testid="pomodoro-timer"] .btn-stop')).toBeVisible();
  });

  test('pauses the timer', async () => {
    await startButton.click();
    await expect(time).toHaveText('25:00');
    await expect(startButton).toHaveText('Pause');
    await expect(time).toHaveText('24:59');

    // paused
    await startButton.click();
    await expect(time).toHaveText('24:59');
    await expect(startButton).toHaveText('Start');

    // start again
    await startButton.click();
    await expect(time).toHaveText('24:58');
  });

  test('stops the timer', async ({ page }) => {
    await startButton.click();
    await expect(time).toHaveText('24:59');

    await page.locator('[data-testid="pomodoro-timer"] .btn-stop').click();

    await expect(time).toHaveText('25:00');
  });
});
