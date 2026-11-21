import { defineConfig, devices } from "@playwright/test";

// Two builds of the same site:
// - port 3456: the default build, no newsletter username (form shows "coming soon")
// - port 3457: a build with NEXT_PUBLIC_BUTTONDOWN_USERNAME=example, in its own
//   dist folder, so the "ready" form state can be tested without a real account.
export const READY_URL = "http://localhost:3457";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:3456" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    {
      name: "mobile",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
  ],
  webServer: [
    {
      command: "npm run build && npm run start -- -p 3456",
      url: "http://localhost:3456",
      timeout: 300_000,
      reuseExistingServer: true,
    },
    ...(process.env.E2E_SKIP_READY ? [] : [{
      command: "NEXT_DIST_DIR=.next-ready NEXT_PUBLIC_BUTTONDOWN_USERNAME=example npm run build && NEXT_DIST_DIR=.next-ready npm run start -- -p 3457",
      url: READY_URL,
      timeout: 300_000,
      reuseExistingServer: true,
    }]),
  ],
});
