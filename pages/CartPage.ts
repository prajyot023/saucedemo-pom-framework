import { type Page, type Locator } from '@playwright/test';

/**
 * Represents a single item in the shopping cart.
 */
export interface CartItem {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

/**
 * CartPage - Page Object for the SauceDemo shopping cart page.
 *
 * Handles cart item inspection, removal, and navigation to
 * checkout or back to the inventory.
 */
export class CartPage {
  /* ── Locators (private) ── */
  private readonly cartList: Locator;
  private readonly cartItems: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly checkoutButton: Locator;
  private readonly pageTitle: Locator;

  constructor(private readonly page: Page) {
    this.cartList = page.locator('[data-test="cart-list"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.pageTitle = page.locator('[data-test="title"]');
  }

  /* ── Actions (public) ── */

  /**
   * Check if the cart page is displayed.
   */
  async isPageLoaded(): Promise<boolean> {
    return this.cartList.isVisible();
  }

  /**
   * Get the page title text (e.g., "Your Cart").
   */
  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? '';
  }

  /**
   * Retrieve all items currently in the cart with their details.
   * @returns Array of CartItem objects
   */
  async getCartItems(): Promise<CartItem[]> {
    const items: CartItem[] = [];
    const count = await this.cartItems.count();

    for (let i = 0; i < count; i++) {
      const item = this.cartItems.nth(i);
      const name = (await item.locator('[data-test="inventory-item-name"]').textContent()) ?? '';
      const description = (await item.locator('[data-test="inventory-item-desc"]').textContent()) ?? '';
      const priceText = (await item.locator('[data-test="inventory-item-price"]').textContent()) ?? '$0';
      const quantityText = (await item.locator('[data-test="item-quantity"]').textContent()) ?? '0';

      items.push({
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(priceText.replace('$', '')),
        quantity: parseInt(quantityText.trim(), 10),
      });
    }

    return items;
  }

  /**
   * Get the number of items in the cart.
   */
  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /**
   * Remove a specific item from the cart by product name.
   * @param productName - The exact name of the product to remove
   */
  async removeItem(productName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: productName });
    await item.locator('button', { hasText: 'Remove' }).click();
  }

  /**
   * Click "Continue Shopping" to return to the inventory page.
   */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /**
   * Click "Checkout" to proceed to the checkout flow.
   */
  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Get all cart item names as an array of strings.
   */
  async getCartItemNames(): Promise<string[]> {
    const names = this.page.locator(
      '[data-test="cart-list"] [data-test="inventory-item-name"]'
    );
    return names.allTextContents();
  }
}
