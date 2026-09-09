# ==============================================================================
# SauceDemo POM Framework - Dockerfile
# ==============================================================================
# Uses the official Microsoft Playwright image which includes all browser
# binaries and OS-level dependencies pre-installed.
# ==============================================================================

FROM mcr.microsoft.com/playwright:v1.52.0-noble

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json* ./

# Install dependencies (ci mode for deterministic builds)
RUN npm ci

# Copy the rest of the project files
COPY . .

# Default command: run all tests in headless mode
CMD ["npx", "playwright", "test"]
