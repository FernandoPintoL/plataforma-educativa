import { test, expect } from '@playwright/test';

/**
 * Frontend E2E Tests for Vocational System
 *
 * Prerrequisitos:
 * - Laravel app running on http://localhost:8000
 * - Student user logged in
 * - At least one active vocational test in database
 *
 * Run with: npx playwright test tests/Frontend/vocacional-e2e.spec.ts
 */

const BASE_URL = 'http://localhost:8000';

test.describe('Vocational System - Frontend E2E', () => {
  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    // Navigate to login
    await page.goto(`${BASE_URL}/login`);

    // Login as student
    await page.fill('input[name="email"]', 'student@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`);
  });

  // Test 1: Navigate to vocational guidance page
  test('Should navigate to vocational guidance page', async ({ page }) => {
    await page.goto(`${BASE_URL}/vocacional`);

    // Check page title
    await expect(page.locator('h1')).toContainText('Orientación Vocacional');

    // Check tabs are visible
    await expect(page.locator('button:has-text("Tests Vocacionales")')).toBeVisible();
    await expect(page.locator('button:has-text("Mi Perfil")')).toBeVisible();
    await expect(page.locator('button:has-text("Recomendaciones")')).toBeVisible();
  });

  // Test 2: Load available tests
  test('Should display available vocational tests', async ({ page }) => {
    await page.goto(`${BASE_URL}/vocacional`);

    // Wait for tests to load
    await page.waitForSelector('.bg-gray-50', { timeout: 5000 });

    // Check if tests are displayed
    const testCards = page.locator('.bg-gray-50');
    const count = await testCards.count();

    expect(count).toBeGreaterThan(0);

    // Check first test card structure
    const firstCard = testCards.first();
    await expect(firstCard.locator('h4')).toBeVisible();
    await expect(firstCard.locator('button:has-text("Comenzar Test")')).toBeVisible();
  });

  // Test 3: Start a vocational test
  test('Should start a vocational test', async ({ page }) => {
    await page.goto(`${BASE_URL}/vocacional`);

    // Wait for tests to load
    await page.waitForSelector('.bg-gray-50', { timeout: 5000 });

    // Click first "Comenzar Test" button
    await page.click('.bg-gray-50 button:has-text("Comenzar Test")');

    // Wait for test page to load
    await page.waitForURL(/\/tests-vocacionales\/\d+\/tomar/, { timeout: 5000 });

    // Check test interface
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Progreso')).toBeVisible();
    await expect(page.locator('.font-mono')).toBeVisible(); // Timer
  });

  // Test 4: Answer all test questions and validate completion
  test('Should answer all test questions and enable submit button', async ({ page }) => {
    await page.goto(`${BASE_URL}/vocacional`);

    // Start test
    await page.waitForSelector('.bg-gray-50', { timeout: 5000 });
    await page.click('.bg-gray-50 button:has-text("Comenzar Test")');

    await page.waitForURL(/\/tests-vocacionales\/\d+\/tomar/, { timeout: 5000 });

    // Wait for all questions to load
    await page.waitForSelector('[role="radiogroup"]', { timeout: 5000 });

    // Get all radio groups (one per question)
    const radioGroups = page.locator('[role="radiogroup"]');
    const questionCount = await radioGroups.count();

    expect(questionCount).toBeGreaterThan(0);

    // Answer all questions
    for (let i = 0; i < questionCount; i++) {
      const group = radioGroups.nth(i);
      const firstOption = group.locator('[role="radio"]').first();
      await firstOption.click();

      // Small delay to ensure response is registered
      await page.waitForTimeout(100);
    }

    // Check submit button becomes enabled
    const submitButton = page.locator('button:has-text("Enviar Respuestas")');
    await expect(submitButton).toBeEnabled();

    // Check success message appears
    await expect(page.locator('text=Listo para enviar')).toBeVisible();
  });

  // Test 5: Submit test responses
  test('Should submit test responses successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/vocacional`);

    // Start test
    await page.waitForSelector('.bg-gray-50', { timeout: 5000 });
    await page.click('.bg-gray-50 button:has-text("Comenzar Test")');

    await page.waitForURL(/\/tests-vocacionales\/\d+\/tomar/, { timeout: 5000 });

    // Answer all questions
    const radioGroups = page.locator('[role="radiogroup"]');
    const questionCount = await radioGroups.count();

    for (let i = 0; i < questionCount; i++) {
      const group = radioGroups.nth(i);
      const firstOption = group.locator('[role="radio"]').first();
      await firstOption.click();
      await page.waitForTimeout(100);
    }

    // Set up listener for confirmation dialog
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    // Click submit button
    await page.click('button:has-text("Enviar Respuestas")');

    // Wait for redirect to results page
    await page.waitForURL(/\/tests-vocacionales\/\d+\/resultados/, { timeout: 10000 });

    // Check results page loaded
    await expect(page.locator('text=¡Test Completado!')).toBeVisible();
  });

  // Test 6: View test results with ML data
  test('Should display test results with ML data', async ({ page }) => {
    // Navigate directly to a results page (assuming student has completed a test)
    // Get test ID from database or from previous test execution
    // For this test, we'll complete a test first

    await page.goto(`${BASE_URL}/vocacional`);
    await page.waitForSelector('.bg-gray-50', { timeout: 5000 });
    await page.click('.bg-gray-50 button:has-text("Comenzar Test")');

    await page.waitForURL(/\/tests-vocacionales\/\d+\/tomar/, { timeout: 5000 });

    // Extract test ID from URL
    const testId = page.url().match(/\/tests-vocacionales\/(\d+)/)?.[1];

    // Answer and submit
    const radioGroups = page.locator('[role="radiogroup"]');
    const questionCount = await radioGroups.count();

    for (let i = 0; i < questionCount; i++) {
      const group = radioGroups.nth(i);
      await group.locator('[role="radio"]').first().click();
      await page.waitForTimeout(100);
    }

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.click('button:has-text("Enviar Respuestas")');
    await page.waitForURL(/\/resultados/, { timeout: 10000 });

    // Check results page elements
    await expect(page.locator('text=¡Test Completado!')).toBeVisible();
    await expect(page.locator('text=Preguntas respondidas')).toBeVisible();
    await expect(page.locator('text=Completado')).toBeVisible();
  });

  // Test 7: View vocational profile
  test('Should view vocational profile after completing test', async ({ page }) => {
    await page.goto(`${BASE_URL}/vocacional`);

    // Click on "Mi Perfil" tab
    await page.click('button:has-text("Mi Perfil")');

    // Check if profile section is visible
    // Profile could be empty or have data depending on whether student completed tests
    const profileText = page.locator('text=Mi Perfil Vocacional');
    await expect(profileText).toBeVisible();

    // If profile exists, check for profile data
    const profileContent = page.locator('.space-y-6').last();
    const hasProfile = await profileContent.locator('text=Sin Perfil Aún').isVisible({ timeout: 1000 }).catch(() => false);

    if (!hasProfile) {
      // Profile data should be present
      await expect(profileContent.locator('text=Intereses')).toBeVisible();
    }
  });

  // Test 8: View career recommendations
  test('Should view career recommendations', async ({ page }) => {
    await page.goto(`${BASE_URL}/vocacional`);

    // Click on "Recomendaciones" tab
    await page.click('button:has-text("Recomendaciones")');

    // Check title
    await expect(page.locator('text=Carreras Recomendadas')).toBeVisible();

    // Recommendations could be empty or have data
    const recommendationsSection = page.locator('.space-y-6').last();
    const hasRecommendations = await recommendationsSection.locator('text=Sin Recomendaciones Aún').isVisible({ timeout: 1000 }).catch(() => false);

    if (!hasRecommendations) {
      // Should have career cards
      const careerCards = recommendationsSection.locator('.border.border-gray-200');
      await expect(careerCards.first()).toBeVisible();
    }
  });

  // Test 9: Keyboard navigation through questions
  test('Should support keyboard navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/vocacional`);
    await page.waitForSelector('.bg-gray-50', { timeout: 5000 });
    await page.click('.bg-gray-50 button:has-text("Comenzar Test")');

    await page.waitForURL(/\/tests-vocacionales\/\d+\/tomar/, { timeout: 5000 });
    await page.waitForSelector('[role="radiogroup"]', { timeout: 5000 });

    // Focus first radio button
    const firstRadio = page.locator('[role="radio"]').first();
    await firstRadio.focus();

    // Use arrow keys to select
    await page.keyboard.press('ArrowDown');

    // Check if selection changed
    const selectedRadio = page.locator('[role="radio"][aria-checked="true"]').first();
    await expect(selectedRadio).toBeVisible();
  });

  // Test 10: Auto-save draft functionality
  test('Should auto-save test draft to localStorage', async ({ page }) => {
    await page.goto(`${BASE_URL}/vocacional`);
    await page.waitForSelector('.bg-gray-50', { timeout: 5000 });
    await page.click('.bg-gray-50 button:has-text("Comenzar Test")');

    await page.waitForURL(/\/tests-vocacionales\/\d+\/tomar/, { timeout: 5000 });

    // Answer first few questions
    const radioGroups = page.locator('[role="radiogroup"]');
    for (let i = 0; i < 2; i++) {
      const group = radioGroups.nth(i);
      await group.locator('[role="radio"]').first().click();
      await page.waitForTimeout(100);
    }

    // Check localStorage for draft
    const draft = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      const draftKey = keys.find((k) => k.startsWith('test_draft_'));
      return draftKey ? localStorage.getItem(draftKey) : null;
    });

    expect(draft).toBeTruthy();
    expect(draft).toContain('respuestas');
  });

  // Test 11: Response validation prevents incomplete submission
  test('Should prevent submitting incomplete test', async ({ page }) => {
    await page.goto(`${BASE_URL}/vocacional`);
    await page.waitForSelector('.bg-gray-50', { timeout: 5000 });
    await page.click('.bg-gray-50 button:has-text("Comenzar Test")');

    await page.waitForURL(/\/tests-vocacionales\/\d+\/tomar/, { timeout: 5000 });

    // Try to submit without answering
    const submitButton = page.locator('button:has-text("Enviar Respuestas")');

    // Button should be disabled
    await expect(submitButton).toBeDisabled();

    // Check warning message
    await expect(
      page.locator('text=Completa todas las preguntas antes de enviar')
    ).toBeVisible();
  });

  // Test 12: Timer functionality
  test('Should display countdown timer', async ({ page }) => {
    await page.goto(`${BASE_URL}/vocacional`);
    await page.waitForSelector('.bg-gray-50', { timeout: 5000 });
    await page.click('.bg-gray-50 button:has-text("Comenzar Test")');

    await page.waitForURL(/\/tests-vocacionales\/\d+\/tomar/, { timeout: 5000 });

    // Check timer is visible
    const timer = page.locator('.font-mono');
    await expect(timer).toBeVisible();

    // Check timer format (MM:SS)
    const timerText = await timer.textContent();
    expect(timerText).toMatch(/\d{2}:\d{2}/);
  });

  // Test 13: Progress bar updates
  test('Should update progress bar as questions are answered', async ({ page }) => {
    await page.goto(`${BASE_URL}/vocacional`);
    await page.waitForSelector('.bg-gray-50', { timeout: 5000 });
    await page.click('.bg-gray-50 button:has-text("Comenzar Test")');

    await page.waitForURL(/\/tests-vocacionales\/\d+\/tomar/, { timeout: 5000 });
    await page.waitForSelector('[role="radiogroup"]', { timeout: 5000 });

    // Get initial progress
    let progressText = await page.locator('text=/\\d+ de \\d+ respuestas/').textContent();
    expect(progressText).toMatch(/0 de \d+ respuestas/);

    // Answer first question
    await page.locator('[role="radiogroup"]').first().locator('[role="radio"]').first().click();

    // Check progress updated
    await page.waitForTimeout(200);
    progressText = await page.locator('text=/\\d+ de \\d+ respuestas/').textContent();
    expect(progressText).not.toMatch(/0 de \d+ respuestas/);
  });

  // Test 14: Responsive design on mobile
  test('Should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto(`${BASE_URL}/vocacional`);

    // Check title is visible on mobile
    await expect(page.locator('h1')).toBeVisible();

    // Check tabs are in mobile-friendly layout
    const tabs = page.locator('button:has-text("Tests Vocacionales")');
    await expect(tabs).toBeVisible();

    // Check content is responsive
    const container = page.locator('.container');
    const width = await container.evaluate((el) => el.offsetWidth);
    expect(width).toBeLessThanOrEqual(400); // Mobile width
  });

  // Test 15: Error handling for network issues
  test('Should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/vocacional/**', (route) => {
      route.abort('failed');
    });

    await page.goto(`${BASE_URL}/vocacional`);

    // Should show error message
    await expect(
      page.locator('text=/Error|error/i').first()
    ).toBeVisible({ timeout: 5000 });
  });
});
