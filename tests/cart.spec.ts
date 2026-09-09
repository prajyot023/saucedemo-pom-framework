import { test, expect } from '../fixtures/page-objects';
import { DEFAULT_USER } from '../utils/test-helpers';

/**
 * Cart Feature Tests
 *
 * Validates shopping cart functionality including:
 * - Item details display (name, description, price, quantity)
 * - Item removal from cart
 * - Continue shopping navigation
 * - Multi-item cart handling
 * - Empty cart state
 */
test.describe('Cart Page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(DEFAULT_USER.username, DEFAULT_USER.password);
  });

  /* ── Item Display Tests ── */

  test('should display correct item details in cart', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const items = await cartPage.getCartItems();
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Sauce Labs Backpack');
    expect(items[0].price).toBe(29.99);
    expect(items[0].quantity).toBe(1);
  });

  test('should display correct count for multiple items', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Onesie');
    await inventoryPage.goToCart();

    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(3);
  });

  test('should display all added items with correct details', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Fleece Jacket');
    await inventoryPage.goToCart();

    const items = await cartPage.getCartItems();
    expect(items).toHaveLength(2);

    const names = items.map((item) => item.name);
    expect(names).toContain('Sauce Labs Backpack');
    expect(names).toContain('Sauce Labs Fleece Jacket');

    // Verify prices
    const backpack = items.find((i) => i.name === 'Sauce Labs Backpack');
    const jacket = items.find((i) => i.name === 'Sauce Labs Fleece Jacket');
    expect(backpack?.price).toBe(29.99);
    expect(jacket?.price).toBe(49.99);
  });

  /* ── Item Removal Tests ── */

  test('should remove an item from the cart', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();

    // Remove one item
    await cartPage.removeItem('Sauce Labs Backpack');

    const items = await cartPage.getCartItems();
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Sauce Labs Bike Light');
  });

  /* ── Navigation Tests ── */

  test('should return to inventory when clicking Continue Shopping', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.goToCart();
    await cartPage.continueShopping();

    expect(await inventoryPage.isPageLoaded()).toBe(true);
    expect(await inventoryPage.getPageTitle()).toBe('Products');
  });

  test('should proceed to checkout from cart', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    const title = await checkoutPage.getPageTitle();
    expect(title).toContain('Checkout: Your Information');
  });

  /* ── Edge Case Tests ── */

  test('should show empty cart when no items added', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.goToCart();

    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(0);
  });

  test('should show empty cart after removing all items', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await cartPage.removeItem('Sauce Labs Backpack');

    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(0);
  });
});
