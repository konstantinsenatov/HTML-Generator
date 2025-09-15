import { test, expect } from '@playwright/test';

test.describe('Bot HTML Preview', () => {
  test('should load taskpane', async ({ page }) => {
    await page.goto('/taskpane.html');
    
    // Проверяем, что страница загрузилась
    await expect(page).toHaveTitle(/Bot HTML Generator/);
    
    // Проверяем основные элементы
    await expect(page.locator('h3')).toContainText('Bot HTML Generator');
    await expect(page.locator('button')).toContainText('Обновить');
  });

  test('should display preview panel', async ({ page }) => {
    await page.goto('/taskpane.html');
    
    // Проверяем наличие панели превью
    await expect(page.locator('text=Превью HTML')).toBeVisible();
    await expect(page.locator('text=Превью будет доступно после чтения документа')).toBeVisible();
  });

  test('should display action buttons', async ({ page }) => {
    await page.goto('/taskpane.html');
    
    // Проверяем кнопки действий
    await expect(page.locator('text=📋 Копировать HTML')).toBeVisible();
    await expect(page.locator('text=🎨 Копировать HTML+CSS')).toBeVisible();
    await expect(page.locator('text=👁️ Открыть превью')).toBeVisible();
    await expect(page.locator('text=📄 Сохранить PDF')).toBeVisible();
  });

  test('should show status bar', async ({ page }) => {
    await page.goto('/taskpane.html');
    
    // Проверяем статус бар
    await expect(page.locator('text=Готов к работе')).toBeVisible();
    await expect(page.locator('text=Bot HTML v1.0.0')).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    await page.goto('/taskpane.html');
    
    // Проверяем на мобильном размере
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Элементы должны оставаться видимыми
    await expect(page.locator('h3')).toBeVisible();
    await expect(page.locator('button')).toBeVisible();
  });
});
