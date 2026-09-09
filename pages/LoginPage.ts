import { type Page, type Locator } from '@playwright/test';

/**
 * LoginPage - Page Object for the SauceDemo login screen.
 *
 * Encapsulates all login-related interactions including authentication,
 * error message retrieval, and page state verification.
 */
export class LoginPage {
  /* ── Locators (private) ── */
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorButton: Locator;
  private readonly loginLogo: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorButton = page.locator('.error-button');
    this.loginLogo = page.locator('.login_logo');
  }

  /* ── Actions (public) ── */

  /**
   * Navigate to the login page.
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Perform a login with the given credentials.
   * @param username - The username to enter
   * @param password - The password to enter
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Submit the login form without entering any credentials.
   * Useful for testing empty-field validation.
   */
  async submitEmptyForm(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Enter only the username and submit.
   * @param username - The username to enter
   */
  async loginWithUsernameOnly(username: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.loginButton.click();
  }

  /**
   * Enter only the password and submit.
   * @param password - The password to enter
   */
  async loginWithPasswordOnly(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Retrieve the error message text displayed on login failure.
   * @returns The error message string
   */
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  /**
   * Check whether an error message is currently visible.
   */
  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  /**
   * Dismiss the error message by clicking the close button.
   */
  async dismissError(): Promise<void> {
    await this.errorButton.click();
  }

  /**
   * Check whether the login page is currently displayed.
   */
  async isLoginPageVisible(): Promise<boolean> {
    return this.loginLogo.isVisible();
  }

  /**
   * Check whether the login button is visible and enabled.
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return this.loginButton.isVisible();
  }
}
