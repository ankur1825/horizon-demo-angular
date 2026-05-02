# Horizon Demo Angular

Dummy Angular application for validating the Horizon DevOps Pipeline service.

Use this repo with:

- `ProjectType`: `Angular`
- `RepositoryType`: `GitHub`
- `Branch`: `main`

Build commands expected by the pipeline:

- `npm install`
- `npm run prodbuild`
- Docker image build from `Dockerfile`

## QA Browser Testing

The Test Devops Pipeline can run browser validation against a deployed QA URL:

```bash
TARGET_APP_URL=https://<qa-app-url> \
SELENIUM_REPORT_DIR=reports/selenium \
npm run test:e2e
```

The Playwright-based tests generate:

- `reports/selenium/junit.xml`
- `reports/selenium/html-report/`
- screenshots, traces, and videos under `reports/selenium/artifacts/` on failure

For local testing, start the app first:

```bash
npm install
npm start
TARGET_APP_URL=http://localhost:4200 npm run test:e2e
```
