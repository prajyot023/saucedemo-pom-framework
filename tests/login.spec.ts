import { test, expect } from '../fixtures/page-objects';
import users from '../test-data/users.json';
import { DEFAULT_USER } from '../utils/test-helpers';

/**
 * Login Feature Tests
 *
 * Validates authentication flows including:
 * - Valid login with standard credentials
 * - Locked-out user rejection
 * - Invalid credential handling
 * - Empty field validation
 * - Data-driven login across all user types
 * - Logout functionality
 */
test.describe('Login Page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  /* ── Happy Path Tests ── */

  test('should login successfully with standard_user credentials', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(DEFAULT_USER.username, DEFAULT_USER.password);

    expect(await inventoryPage.isPageLoaded()).toBe(true);
    expect(await inventoryPage.getPageTitle()).toBe('Products');
  });

  test('should display the login page with all elements visible', async ({
    loginPage,
  }) => {
    expect(await loginPage.isLoginPageVisible()).toBe(true);
    expect(await loginPage.isLoginButtonVisible()).toBe(true);
  });

  /* ── Data-Driven Login Tests ── */

  for (const [userType, userData] of Object.entries(users)) {
    if (userData.shouldLogin) {
      test(`should login successfully as ${userType}`, async ({
        loginPage,
        inventoryPage,
      }) => {
        await loginPage.login(userData.username, userData.password);

        expect(await inventoryPage.isPageLoaded()).toBe(true);
      });
    }
  }

  /* ── Negative Tests ── */

  test('should show error for locked_out_user', async ({ loginPage }) => {
    const lockedUser = users.locked_out_user;

    await loginPage.login(lockedUser.username, lockedUser.password);

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain(
      'Sorry, this user has been locked out'
    );
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    const invalidUser = users.invalid_user;

    await loginPage.login(invalidUser.username, invalidUser.password);

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain(
      'Username and password do not match any user in this service'
    );
  });

  test('should show error when username is empty', async ({ loginPage }) => {
    await loginPage.loginWithPasswordOnly('secret_sauce');

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain('Username is required');
  });

  test('should show error when password is empty', async ({ loginPage }) => {
    await loginPage.loginWithUsernameOnly('standard_user');

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain('Password is required');
  });

  test('should show error when both fields are empty', async ({
    loginPage,
  }) => {
    await loginPage.submitEmptyForm();

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain('Username is required');
  });

  /* ── Logout Test ── */

  test('should logout and return to login page', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(DEFAULT_USER.username, DEFAULT_USER.password);
    expect(await inventoryPage.isPageLoaded()).toBe(true);

    await inventoryPage.logout();

    expect(await loginPage.isLoginPageVisible()).toBe(true);
  });
});
