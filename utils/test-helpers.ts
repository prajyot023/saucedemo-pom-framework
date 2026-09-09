/**
 * Shared test utility functions.
 *
 * Provides reusable helpers for price parsing, tax calculations,
 * and other common test operations.
 */

/**
 * Parse a price string (e.g., "$29.99") into a numeric value.
 * @param priceText - The price string to parse
 * @returns The numeric price value
 */
export function formatPrice(priceText: string): number {
  const cleaned = priceText.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Calculate the expected tax for a given subtotal.
 * SauceDemo applies an 8% tax rate (rounded to 2 decimal places).
 * @param subtotal - The pre-tax subtotal
 * @returns The calculated tax amount
 */
export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * 0.08 * 100) / 100;
}

/**
 * Calculate the expected total (subtotal + tax).
 * @param subtotal - The pre-tax subtotal
 * @returns The total including tax
 */
export function calculateTotal(subtotal: number): number {
  const tax = calculateTax(subtotal);
  return Math.round((subtotal + tax) * 100) / 100;
}

/**
 * Generate a random alphanumeric string of the specified length.
 * Useful for edge-case testing with unusual input.
 * @param length - The desired string length (default: 10)
 * @returns A random string
 */
export function generateRandomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Standard credentials for the default test user.
 * Centralizes credentials to avoid magic strings in test files.
 */
export const DEFAULT_USER = {
  username: 'standard_user',
  password: 'secret_sauce',
} as const;
