import { test as base } from '@playwright/test';
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from '../pages';

/**
 * Custom fixture types injected into every test.
 *
 * By declaring page objects here, each test receives fully instantiated
 * page objects via destructuring — eliminating repeated `new PageX(page)` calls.
 */
interface PageObjectFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
}

/**
 * Extended test function with auto-injected page objects.
 *
 * Usage in spec files:
 * ```ts
 * import { test, expect } from '../fixtures/page-objects';
 *
 * test('example', async ({ loginPage, inventoryPage }) => {
 *   await loginPage.goto();
 *   await loginPage.login('standard_user', 'secret_sauce');
 *   expect(await inventoryPage.isPageLoaded()).toBe(true);
 * });
 * ```
 */
export const test = base.extend<PageObjectFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
});

export { expect } from '@playwright/test';
