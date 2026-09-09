# 🎭 SauceDemo — Playwright POM Framework

<div align="center">

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

**A professional-grade E2E test automation framework** demonstrating senior-level SDET skills  
using Playwright, TypeScript, Page Object Model, and CI/CD best practices.

[Live Test Report](https://prajyot023.github.io/saucedemo-pom-framework/) · [SauceDemo Site](https://www.saucedemo.com)

</div>

---

## 📋 Overview

This project is a **portfolio-quality** end-to-end test automation framework targeting the public [SauceDemo](https://www.saucedemo.com) web application. It showcases:

- **Page Object Model (POM)** architecture for maintainable test code
- **Custom Playwright fixtures** for dependency injection
- **Data-driven testing** with parameterized test data
- **Cross-browser testing** across Chromium, Firefox, and WebKit
- **Docker containerization** for portable test execution
- **CI/CD pipeline** with GitHub Actions and live report publishing

## 🧪 Test Coverage

| Feature | Tests | Coverage |
|---------|-------|----------|
| **Login** | 10+ | Valid login, locked-out user, invalid credentials, empty fields, logout |
| **Inventory** | 10 | Product display, A-Z/Z-A/price sorting, add/remove cart items, badge count |
| **Cart** | 8 | Item details, multi-item, removal, continue shopping, empty cart |
| **Checkout** | 14+ | Full E2E purchase, form validation, order summary math, confirmation, cancel |
| **Total** | **~40+ tests** | Includes 8+ negative/edge case tests and data-driven parameterized tests |

## 🏗️ Project Structure

```
saucedemo-pom-framework/
├── pages/                          # Page Object Model classes
│   ├── LoginPage.ts                # Login page interactions
│   ├── InventoryPage.ts            # Product listing & sorting
│   ├── CartPage.ts                 # Shopping cart management
│   ├── CheckoutPage.ts             # Checkout flow (3 steps)
│   └── index.ts                    # Barrel exports
├── tests/                          # Test spec files by feature
│   ├── login.spec.ts               # Authentication tests
│   ├── inventory.spec.ts           # Product & sorting tests
│   ├── cart.spec.ts                # Cart management tests
│   └── checkout.spec.ts            # Checkout & purchase tests
├── fixtures/                       # Custom Playwright fixtures
│   └── page-objects.ts             # Auto-injects page objects
├── test-data/                      # Data sets for parameterized tests
│   ├── users.json                  # SauceDemo user credentials
│   ├── products.json               # Product combinations & prices
│   └── checkout-users.json         # Checkout form validation data
├── utils/                          # Shared helper functions
│   └── test-helpers.ts             # Price parsing, tax calc, etc.
├── playwright.config.ts            # Playwright configuration
├── Dockerfile                      # Docker image definition
├── docker-compose.yml              # One-command Docker execution
├── .github/workflows/
│   └── playwright.yml              # CI/CD pipeline
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/) (optional, for containerized runs)

### Local Setup

```bash
# Clone the repository
git clone https://github.com/prajyot023/saucedemo-pom-framework.git
cd saucedemo-pom-framework

# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps
```

### Running Tests

```bash
# Run all tests (headless, all browsers)
npm test

# Run in headed mode (watch tests execute)
npm run test:headed

# Run specific browser only
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Debug mode with Playwright Inspector
npm run test:debug

# Interactive UI mode
npm run test:ui

# View the HTML report after a test run
npm run report
```

### Docker Execution

```bash
# Build and run tests in Docker (one command)
docker-compose up --build

# Reports are available at ./playwright-report/index.html
```

## 🏛️ Architecture

### Page Object Model

Each page class encapsulates:
- **Private locators** — CSS/data-test selectors as class properties
- **Public action methods** — User interactions that return data, not assertions
- **No test logic** — Assertions stay in spec files, keeping page objects reusable

```typescript
// Example: LoginPage.ts
export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    // ...
  }
}
```

### Custom Fixtures

Tests use `test.extend()` to auto-inject page objects:

```typescript
// In spec files — no manual instantiation needed
import { test, expect } from '../fixtures/page-objects';

test('should login', async ({ loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  expect(await inventoryPage.isPageLoaded()).toBe(true);
});
```

### Data-Driven Tests

Parameterized tests loop over JSON data sets:

```typescript
for (const [scenario, data] of Object.entries(products)) {
  test(`checkout with ${data.description}`, async ({ ... }) => {
    for (const product of data.products) {
      await inventoryPage.addProductToCart(product);
    }
    // ...
  });
}
```

## ⚙️ CI/CD Pipeline

The GitHub Actions workflow:

1. **Triggers** on every push and PR to `main`
2. **Installs** Node.js, dependencies, and Playwright browsers
3. **Runs** the full test suite (headless, cross-browser)
4. **Uploads** the HTML report as a build artifact
5. **Deploys** the report to GitHub Pages (on `main` branch pushes)

### Live Report

After each CI run on `main`, the latest test report is published to:

🔗 **https://prajyot023.github.io/saucedemo-pom-framework/**

> **Note:** Replace `prajyot023` with your GitHub username. You'll also need to enable
> GitHub Pages in your repository settings (Settings → Pages → Source: GitHub Actions).

## 📸 Sample Report Screenshots

After running the tests locally with `npm test`, open the report with `npm run report`:

<!-- Replace with actual screenshots after first test run -->
| Report Overview | Test Details | Trace Viewer |
|:-:|:-:|:-:|
| ![Report Overview](docs/report-overview.png) | ![Test Details](docs/test-details.png) | ![Trace Viewer](docs/trace-viewer.png) |

## 📝 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **POM pattern** | Separates UI details from test logic; one locator change updates all tests |
| **Custom fixtures** | Eliminates boilerplate `new Page(page)` calls; Playwright-idiomatic DI |
| **Data-driven tests** | JSON files are easily updated without touching test code |
| **Cross-browser** | Validates compatibility across rendering engines |
| **Docker** | Ensures identical execution across dev machines and CI |
| **GitHub Pages reports** | Stakeholders can view results without CI access |

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Playwright](https://playwright.dev/) | Browser automation & test runner |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe test code |
| [Node.js](https://nodejs.org/) | Runtime environment |
| [Docker](https://www.docker.com/) | Containerized test execution |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline |
| [GitHub Pages](https://pages.github.com/) | Live test report hosting |

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

Built with ❤️ as a portfolio project for **Senior QA Automation Engineer (SDET)** roles.

</div>
