import { test, expect } from '@playwright/test';

test.describe('Pomodoro Timer Mode', () => {
  test('switches mode', async ({ page }) => {
    await page.goto('/');

    const body = page.locator('body');
    const time = page.locator('[data-testid="pomodoro-timer"] .time');

    const pomodoroModeButton = page.locator('.mode-controls button', {
      hasText: 'Pomodoro'
    });

    const shortBreakModeButton = page.locator('.mode-controls button', {
      hasText: 'Short Break'
    });

    const longBreakModeButton = page.locator('.mode-controls button', {
      hasText: 'Long Break'
    });

    expect(body).toHaveAttribute('data-mode', 'pomodoro');
    expect(body).toHaveCSS('background-color', 'rgb(232, 128, 128)');

    await shortBreakModeButton.click();

    await expect(time).toHaveText('05:00');
    await expect(body).toHaveAttribute('data-mode', 'shortBreak');
    await expect(body).toHaveCSS('background-color', 'rgb(90, 206, 167)');

    await longBreakModeButton.click();

    await expect(time).toHaveText('15:00');
    await expect(body).toHaveAttribute('data-mode', 'longBreak');
    await expect(body).toHaveCSS('background-color', 'rgb(102, 175, 211)');

    await pomodoroModeButton.click();

    await expect(time).toHaveText('25:00');
    await expect(body).toHaveAttribute('data-mode', 'pomodoro');
    await expect(body).toHaveCSS('background-color', 'rgb(232, 128, 128)');
  });
});
