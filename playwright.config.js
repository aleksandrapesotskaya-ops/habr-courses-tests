/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  testDir: "./tests",
  timeout: 90 * 1000,
  retries: 1,
  workers: 4,
  expect: {
    timeout: 30 * 1000,
  },
  reporter: [["html", { open: "never" }]],
  use: {
    actionTimeout: 60 * 1000,
    baseURL: process.env.URL
      ? process.env.URL
      : "https://master.career.habratest.net/education",
    headless: true,
    trace: "on",
    screenshot: "only-on-failure",
    ignoreHTTPSErrors: true,
    locale: "ru-RU",
  },
};

module.exports = config;
