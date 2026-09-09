import { type Page, type Locator } from '@playwright/test';

/**
 * CheckoutPage - Page Object for the SauceDemo checkout flow.
 *
 * Covers all three checkout stages:
 *   1. Step One  — Shipping information form
 *   2. Step Two  — Order overview / summary
 *   3. Complete  — Order confirmation
 */
export class CheckoutPage {
  /* ── Step One: Information Form ── */
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;

  /* ── Step Two: Overview ── */
  private readonly summaryItems: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;
  private readonly cancelOverviewButton: Locator;

  /* ── Complete ── */
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;
  private readonly backToProductsButton: Locator;

  /* ── Shared ── */
  private readonly pageTitle: Locator;

  constructor(private readonly page: Page) {
    // Step One
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step Two
    this.summaryItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelOverviewButton = page.locator('[data-test="cancel"]');

    // Complete
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');

    // Shared
    this.pageTitle = page.locator('[data-test="title"]');
  }

  /* ── Step One Actions ── */

  /**
   * Fill in the shipping information form.
   * @param firstName - Customer's first name
   * @param lastName  - Customer's last name
   * @param postalCode - Customer's postal/zip code
   */
  async fillShippingInfo(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Click the "Continue" button on the checkout information form.
   */
  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  /**
   * Click the "Cancel" button to go back.
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Retrieve the error message text shown on form validation failure.
   */
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  /**
   * Check whether an error message is currently displayed.
   */
  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  /* ── Step Two Actions ── */

  /**
   * Get the subtotal amount from the order summary.
   * @returns Subtotal as a number
   */
  async getSubtotal(): Promise<number> {
    const text = (await this.subtotalLabel.textContent()) ?? '';
    const match = text.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get the tax amount from the order summary.
   * @returns Tax as a number
   */
  async getTax(): Promise<number> {
    const text = (await this.taxLabel.textContent()) ?? '';
    const match = text.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get the total amount from the order summary.
   * @returns Total as a number
   */
  async getTotal(): Promise<number> {
    const text = (await this.totalLabel.textContent()) ?? '';
    const match = text.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get the number of items listed in the order summary.
   */
  async getSummaryItemCount(): Promise<number> {
    return this.summaryItems.count();
  }

  /**
   * Get all item names listed in the order summary.
   */
  async getSummaryItemNames(): Promise<string[]> {
    const names = this.page.locator(
      '[data-test="inventory-item"] [data-test="inventory-item-name"]'
    );
    return names.allTextContents();
  }

  /**
   * Click the "Finish" button to complete the order.
   */
  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  /* ── Complete Page Actions ── */

  /**
   * Get the order confirmation header text.
   * @returns Header text (e.g., "Thank you for your order!")
   */
  async getCompletionHeader(): Promise<string> {
    return (await this.completeHeader.textContent()) ?? '';
  }

  /**
   * Get the order confirmation body text.
   */
  async getCompletionText(): Promise<string> {
    return (await this.completeText.textContent()) ?? '';
  }

  /**
   * Click "Back Home" to return to the products page.
   */
  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  /* ── Shared ── */

  /**
   * Get the current page title (changes per checkout step).
   */
  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? '';
  }
}
