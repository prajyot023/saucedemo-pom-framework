import { type Page, type Locator } from '@playwright/test';

/**
 * InventoryPage - Page Object for the SauceDemo product listing page.
 *
 * Handles product browsing, sorting, cart interactions from the inventory view,
 * and sidebar navigation (including logout).
 */
export class InventoryPage {
  /* ── Locators (private) ── */
  private readonly inventoryContainer: Locator;
  private readonly inventoryItems: Locator;
  private readonly sortDropdown: Locator;
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;
  private readonly closeSidebarButton: Locator;
  private readonly pageTitle: Locator;

  constructor(private readonly page: Page) {
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.closeSidebarButton = page.getByRole('button', { name: 'Close Menu' });
    this.pageTitle = page.locator('[data-test="title"]');
  }

  /* ── Actions (public) ── */

  /**
   * Verify the inventory page is loaded and visible.
   */
  async isPageLoaded(): Promise<boolean> {
    return this.inventoryContainer.isVisible();
  }

  /**
   * Get the page title text (e.g., "Products").
   */
  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? '';
  }

  /**
   * Get all product names displayed on the inventory page.
   * @returns Array of product name strings
   */
  async getProductNames(): Promise<string[]> {
    const names = this.page.locator('[data-test="inventory-item-name"]');
    return names.allTextContents();
  }

  /**
   * Get all product prices as numeric values.
   * @returns Array of prices (numbers)
   */
  async getProductPrices(): Promise<number[]> {
    const priceElements = this.page.locator('[data-test="inventory-item-price"]');
    const priceTexts = await priceElements.allTextContents();
    return priceTexts.map((text) => parseFloat(text.replace('$', '')));
  }

  /**
   * Sort products using the dropdown.
   * @param option - Sort option value: 'az' | 'za' | 'lohi' | 'hilo'
   */
  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Add a product to the cart by its visible name.
   * @param productName - The exact product name displayed on the page
   */
  async addProductToCart(productName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.locator('button', { hasText: 'Add to cart' }).click();
  }

  /**
   * Remove a product from the cart via the inventory page button.
   * @param productName - The exact product name displayed on the page
   */
  async removeProductFromCart(productName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.locator('button', { hasText: 'Remove' }).click();
  }

  /**
   * Get the current cart badge count.
   * @returns The badge count, or 0 if no badge is displayed
   */
  async getCartBadgeCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  /**
   * Navigate to the cart page by clicking the cart icon.
   */
  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  /**
   * Get the total number of inventory items displayed.
   */
  async getInventoryItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  /**
   * Open the sidebar navigation menu.
   */
  async openSidebarMenu(): Promise<void> {
    await this.menuButton.click();
  }

  /**
   * Close the sidebar navigation menu.
   */
  async closeSidebarMenu(): Promise<void> {
    await this.closeSidebarButton.click();
  }

  /**
   * Log out of the application via the sidebar menu.
   */
  async logout(): Promise<void> {
    await this.openSidebarMenu();
    await this.logoutLink.click();
  }
}
