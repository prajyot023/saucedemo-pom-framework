import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration
 *
 * Configures cross-browser testing (Chromium, Firefox, WebKit),
 * retry behavior, tracing, screenshots, video capture, and reporting.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /* Directory containing test spec files */
  testDir: './tests',

  /* Run tests in parallel across files */
  fullyParallel: true,

  /* Fail the build on CI if test.only is accidentally left in source */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests: 2 retries on CI, none locally */
  retries: process.env.CI ? 2 : 0,

  /* Limit parallel workers on CI to prevent flakiness */
  workers: process.env.CI ? 2 : undefined,

  /* Reporters: HTML for rich reports, list for terminal output */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  /* Global test timeout */
  timeout: 30_000,

  /* Shared settings applied to all projects */
  use: {
    /* Base URL for navigating with relative paths */
    baseURL: 'https://www.saucedemo.com',

    /* Capture trace on first retry for debugging flaky tests */
    trace: 'on-first-retry',

    /* Screenshot only on test failure to minimize noise */
    screenshot: 'only-on-failure',

    /* Retain video recordings only for failed tests */
    video: 'retain-on-failure',

    /* Default action timeout */
    actionTimeout: 10_000,

    /* Navigation timeout */
    navigationTimeout: 15_000,
  },

  /* Cross-browser project definitions */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
