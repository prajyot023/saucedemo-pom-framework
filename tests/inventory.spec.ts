import { test, expect } from '../fixtures/page-objects';
import { DEFAULT_USER } from '../utils/test-helpers';

/**
 * Inventory Feature Tests
 *
 * Validates product listing functionality including:
 * - Product display after login
 * - Sorting (A-Z, Z-A, price low-high, price high-low)
 * - Add/remove items from cart via inventory page
 * - Cart badge count updates
 */
test.describe('Inventory Page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(DEFAULT_USER.username, DEFAULT_USER.password);
  });

  /* ── Product Display Tests ── */

  test('should display products after successful login', async ({
    inventoryPage,
  }) => {
    expect(await inventoryPage.isPageLoaded()).toBe(true);
    expect(await inventoryPage.getPageTitle()).toBe('Products');

    const itemCount = await inventoryPage.getInventoryItemCount();
    expect(itemCount).toBe(6);
  });

  test('should display all six product names', async ({ inventoryPage }) => {
    const productNames = await inventoryPage.getProductNames();

    expect(productNames).toHaveLength(6);
    expect(productNames).toContain('Sauce Labs Backpack');
    expect(productNames).toContain('Sauce Labs Bike Light');
    expect(productNames).toContain('Sauce Labs Bolt T-Shirt');
    expect(productNames).toContain('Sauce Labs Fleece Jacket');
    expect(productNames).toContain('Sauce Labs Onesie');
    expect(productNames).toContain('Test.allTheThings() T-Shirt (Red)');
  });

  /* ── Sorting Tests ── */

  test('should sort products A to Z (default)', async ({ inventoryPage }) => {
    await inventoryPage.sortProducts('az');

    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('should sort products Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortProducts('za');

    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('should sort products by price low to high', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortProducts('lohi');

    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('should sort products by price high to low', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortProducts('hilo');

    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  /* ── Cart Interaction Tests ── */

  test('should update cart badge when adding a single item', async ({
    inventoryPage,
  }) => {
    // Initially no badge
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('should update cart badge count for multiple items', async ({
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');

    expect(await inventoryPage.getCartBadgeCount()).toBe(3);
  });

  test('should decrement cart badge when removing an item', async ({
    inventoryPage,
  }) => {
    // Add two items
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    // Remove one
    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('should hide cart badge when all items are removed', async ({
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });
});
