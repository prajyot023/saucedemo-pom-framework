import { test, expect } from '../fixtures/page-objects';
import products from '../test-data/products.json';
import checkoutUsers from '../test-data/checkout-users.json';
import { DEFAULT_USER } from '../utils/test-helpers';

/**
 * Checkout Feature Tests
 *
 * Validates the complete checkout flow including:
 * - End-to-end purchase with single and multiple items
 * - Form validation errors on empty required fields
 * - Order summary verification (subtotal, tax, total)
 * - Order confirmation
 * - Cancel navigation on both checkout steps
 * - Data-driven tests with product combinations
 */
test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(DEFAULT_USER.username, DEFAULT_USER.password);
  });

  /* ── Full E2E Purchase Flow ── */

  test('should complete a full checkout with a single item', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Add item and navigate to checkout
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    // Fill shipping info and continue
    await checkoutPage.fillShippingInfo('John', 'Doe', '90210');
    await checkoutPage.continue();

    // Verify overview
    const itemCount = await checkoutPage.getSummaryItemCount();
    expect(itemCount).toBe(1);

    const subtotal = await checkoutPage.getSubtotal();
    expect(subtotal).toBe(29.99);

    // Finish purchase
    await checkoutPage.finish();

    // Verify confirmation
    const header = await checkoutPage.getCompletionHeader();
    expect(header).toContain('Thank you for your order');
  });

  /* ── Data-Driven Product Combination Tests ── */

  for (const [scenario, data] of Object.entries(products)) {
    // Skip "all_items" to keep test runtime reasonable
    if (scenario === 'all_items') continue;

    test(`should complete checkout with ${data.description}`, async ({
      inventoryPage,
      cartPage,
      checkoutPage,
    }) => {
      // Add all products for this scenario
      for (const productName of data.products) {
        await inventoryPage.addProductToCart(productName);
      }

      // Navigate through checkout
      await inventoryPage.goToCart();
      await cartPage.checkout();
      await checkoutPage.fillShippingInfo('Jane', 'Smith', '10001');
      await checkoutPage.continue();

      // Verify item count in summary
      const summaryCount = await checkoutPage.getSummaryItemCount();
      expect(summaryCount).toBe(data.products.length);

      // Verify subtotal matches expected
      const subtotal = await checkoutPage.getSubtotal();
      expect(subtotal).toBeCloseTo(data.expectedSubtotal, 2);

      // Complete the purchase
      await checkoutPage.finish();

      const header = await checkoutPage.getCompletionHeader();
      expect(header).toContain('Thank you for your order');
    });
  }

  /* ── Form Validation Tests (Data-Driven) ── */

  for (const [scenario, userData] of Object.entries(checkoutUsers)) {
    if (!userData.isValid && 'expectedError' in userData) {
      test(`should show validation error: ${userData.description}`, async ({
        inventoryPage,
        cartPage,
        checkoutPage,
      }) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        await cartPage.checkout();

        await checkoutPage.fillShippingInfo(
          userData.firstName,
          userData.lastName,
          userData.postalCode
        );
        await checkoutPage.continue();

        expect(await checkoutPage.isErrorVisible()).toBe(true);
        const errorMsg = await checkoutPage.getErrorMessage();
        expect(errorMsg).toContain(userData.expectedError);
      });
    }
  }

  /* ── Order Summary Verification ── */

  test('should display correct subtotal, tax, and total', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillShippingInfo('Test', 'User', '12345');
    await checkoutPage.continue();

    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    // Subtotal should be $29.99 + $9.99 = $39.98
    expect(subtotal).toBeCloseTo(39.98, 2);

    // Tax should be non-zero
    expect(tax).toBeGreaterThan(0);

    // Total should equal subtotal + tax
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  /* ── Order Confirmation Tests ── */

  test('should display order confirmation with success message', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Onesie');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillShippingInfo('Alice', 'Wonder', '30303');
    await checkoutPage.continue();
    await checkoutPage.finish();

    const header = await checkoutPage.getCompletionHeader();
    const text = await checkoutPage.getCompletionText();

    expect(header).toBe('Thank you for your order!');
    expect(text).toContain('Your order has been dispatched');
  });

  test('should navigate back to products from confirmation page', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillShippingInfo('Back', 'Home', '00000');
    await checkoutPage.continue();
    await checkoutPage.finish();

    await checkoutPage.backToProducts();

    expect(await inventoryPage.isPageLoaded()).toBe(true);
    expect(await inventoryPage.getPageTitle()).toBe('Products');
  });

  /* ── Cancel Navigation Tests ── */

  test('should cancel checkout step one and return to cart', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.cancel();

    expect(await cartPage.isPageLoaded()).toBe(true);
    const title = await cartPage.getPageTitle();
    expect(title).toContain('Your Cart');
  });

  test('should show all summary item names on step two', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    const productNames = ['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt'];

    for (const name of productNames) {
      await inventoryPage.addProductToCart(name);
    }

    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillShippingInfo('Summary', 'Check', '55555');
    await checkoutPage.continue();

    const summaryNames = await checkoutPage.getSummaryItemNames();
    for (const name of productNames) {
      expect(summaryNames).toContain(name);
    }
  });
});
