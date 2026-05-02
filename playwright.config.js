const path = require('path');

const reportDir = process.env.SELENIUM_REPORT_DIR || 'reports/selenium';

module.exports = {
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: process.env.TARGET_APP_URL || 'http://localhost:4200',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },
  reporter: [
    ['list'],
    ['junit', { outputFile: path.join(reportDir, 'junit.xml') }],
    ['html', { outputFolder: path.join(reportDir, 'html-report'), open: 'never' }]
  ],
  outputDir: path.join(reportDir, 'artifacts'),
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ]
};
