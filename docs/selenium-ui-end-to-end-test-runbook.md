# Selenium UI End-to-End Test Runbook

## Purpose

This runbook validates the Horizon Relevance AI DevSecOps product from an end-client point of view for an Angular application.

The test proves that a client engineer can:

1. Submit an Angular application through the Devops Pipeline.
2. Build the application and Docker image.
3. Push image metadata and artifacts.
4. Deploy the application to DEV.
5. Promote or redeploy the same application to QA.
6. Run Selenium UI testing through the Test Devops Pipeline against the deployed QA URL.
7. Validate Jenkins logs, S3 test artifacts, and UI results.

## Scope

Application under test:

- GitHub repo: `https://github.com/ankur1825/horizon-demo-angular`
- Project type: `Angular`
- Selenium test framework in repo: Playwright-based browser tests
- Test command: `npm run test:e2e`
- Expected report output: `reports/selenium/`

Product URLs:

- Product UI: `https://horizonrelevance.com/pipeline/`
- Backend API docs: `https://horizonrelevance.com/pipeline/api/docs`
- Jenkins: `https://horizonrelevance.com/jenkins/`

## Roles

Client engineer:

- Owns application repo and branch.
- Submits Devops Pipeline and Test Devops Pipeline requests.
- Reviews Jenkins execution and test results.

Platform engineer:

- Ensures product platform is healthy.
- Validates Jenkins, ECR, S3, IAM, Kubernetes, and license configuration.
- Troubleshoots failed pipeline runs.

## Preconditions

Confirm the following before starting:

1. Product frontend is reachable at `https://horizonrelevance.com/pipeline/`.
2. Backend API docs are reachable at `https://horizonrelevance.com/pipeline/api/docs`.
3. Jenkins is reachable and authenticated through LDAP.
4. User can log in to the product UI.
5. Jenkins has access to the Angular GitHub repo.
6. Jenkins has permissions for:
   - Source checkout
   - ECR image push
   - S3 artifact upload
   - EKS kubeconfig update
   - Kubernetes deployment to target namespace
7. Client environment configuration exists for:
   - DEV
   - QA
8. Target namespaces exist or can be created by Jenkins.
9. Docker image repository exists in ECR or Jenkins has permission to create/push to it.
10. Artifact bucket exists for storing:
    - `image.json`
    - `templateconfiguration.json`
    - Selenium reports

## Angular Repo Validation

Before running the product pipeline, confirm the Angular repo contains:

- `package.json`
- `Dockerfile`
- `playwright.config.js`
- `tests/e2e/qa-signoff.spec.js`
- `npm run build` or equivalent production build script
- `npm run test:e2e`

Expected local commands:

```bash
git clone https://github.com/ankur1825/horizon-demo-angular.git
cd horizon-demo-angular
npm install
npm run prodbuild
npm run test:e2e
```

If local Selenium testing requires system Chrome:

```bash
PLAYWRIGHT_CHROME_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:e2e
```

Expected result:

- Build completes successfully.
- Selenium test passes.
- Reports are created under `reports/selenium/`.

## Phase 1: Submit Devops Pipeline For DEV

Open:

```text
https://horizonrelevance.com/pipeline/
```

Select:

- Service: `Devops Pipeline`
- Project type: `Angular`
- Repository type: `GitHub`
- Repository URL: `https://github.com/ankur1825/horizon-demo-angular`
- Branch: target branch, for example `main`
- Environment: `DEV`
- Target namespace: application-specific namespace, for example `horizon-demo-angular-dev`
- Application name: `horizon-demo-angular`
- Notification email: tester or team email

Submit the pipeline.

Expected result in product UI:

- Request is accepted.
- Jenkins job is created or updated.
- Jenkins build number is returned or visible.

## Phase 2: Validate DEV Build In Jenkins

Open Jenkins and locate the job created by the product.

Validate stages:

1. Checkout source
2. Resolve project type as `Angular`
3. Install dependencies
4. Run Angular build
5. Build Docker image
6. Tag image with:
   - short commit SHA
   - `latest`
7. Push image to ECR
8. Create image metadata:
   - `image.json`
   - `templateconfiguration.json`
9. Upload artifacts to S3
10. Update kubeconfig for DEV
11. Deploy to DEV namespace

Expected Jenkins result:

- Build status: `SUCCESS`
- Docker image pushed to ECR
- Metadata uploaded to S3
- Kubernetes deployment completed

## Phase 3: Validate DEV Deployment

Run:

```bash
kubectl get deploy,pods,svc,ingress -n horizon-demo-angular-dev
kubectl rollout status deployment/horizon-demo-angular -n horizon-demo-angular-dev
```

If an ingress or route is created, test the application:

```bash
curl -k -I https://<dev-app-url>
```

Expected result:

- Pod status: `Running`
- Deployment rollout: successful
- Application route returns HTTP `200`

Record the deployed DEV URL in the evidence tracker.

## Phase 4: Submit Devops Pipeline For QA

Use the same product UI and submit another Devops Pipeline request for QA.

Recommended input:

- Service: `Devops Pipeline`
- Project type: `Angular`
- Repository URL: `https://github.com/ankur1825/horizon-demo-angular`
- Branch: same validated branch, for example `main`
- Environment: `QA`
- Target namespace: `horizon-demo-angular-qa`
- Application name: `horizon-demo-angular`
- Notification email: tester or team email

Expected product behavior:

- Jenkins uses QA environment configuration.
- Jenkins updates kubeconfig for the QA cluster or QA context.
- Jenkins deploys to the QA namespace.

Expected result:

- QA deployment succeeds.
- QA application URL is available.

Record the deployed QA URL in the evidence tracker.

## Phase 5: Submit Test Devops Pipeline For Selenium UI

Open:

```text
https://horizonrelevance.com/pipeline/
```

Select:

- Service: `Test Devops Pipeline`
- Project type: `Angular`
- Test tool: `Selenium`
- Repository URL: `https://github.com/ankur1825/horizon-demo-angular`
- Branch: same branch deployed to QA
- Target app URL: QA application URL from Phase 4
- Environment: `QA`
- Target namespace: `horizon-demo-angular-qa`
- Notification email: tester or team email

Submit the test pipeline.

Expected product behavior:

- Backend passes `TARGET_APP_URL` to Jenkins.
- Jenkins checks out the Angular repo.
- Jenkins installs dependencies.
- Jenkins detects `@playwright/test`.
- Jenkins installs Playwright Chromium when required.
- Jenkins runs `npm run test:e2e`.
- Jenkins stores Selenium reports under `reports/selenium/`.
- Jenkins uploads test results to S3.
- Jenkins sends notification if configured.

## Phase 6: Validate Selenium Execution In Jenkins

Open the Test Devops Pipeline Jenkins job.

Validate the Selenium stage logs include:

```text
TARGET_APP_URL=<qa-app-url>
npm run test:e2e
```

Expected test result:

```text
2 passed
```

Expected report files:

- `reports/selenium/junit.xml`
- `reports/selenium/html-report/`
- `reports/selenium/artifacts/`

Expected Jenkins result:

- Build status: `SUCCESS`
- Selenium stage status: `SUCCESS`
- Test reports archived
- S3 upload completed

## Phase 7: Validate S3 Test Artifacts

Locate the artifact path generated by the Jenkins build.

Expected pattern:

```text
s3://<client-artifact-bucket>/test-devops-pipeline/<project-name>/<jenkins-build-number>/test-results/selenium/
```

Validate:

```bash
aws s3 ls s3://<client-artifact-bucket>/test-devops-pipeline/horizon-demo-angular/<build-number>/test-results/selenium/ --recursive
```

Expected result:

- JUnit report exists.
- HTML report exists.
- Failure screenshots/traces exist only if tests failed.

## Phase 8: Negative Test Scenario

To prove the platform catches UI failures:

1. Create a test branch in the Angular repo.
2. Intentionally break one Selenium assertion or UI label.
3. Submit Devops Pipeline to DEV or QA.
4. Submit Test Devops Pipeline with Selenium.

Expected result:

- Jenkins Selenium stage fails.
- Report captures failed assertion.
- Screenshot, trace, or HTML report is uploaded.
- Pipeline status is marked failed.
- Notification is sent if enabled.

Recommended branch name:

```text
qa/intentional-ui-failure
```

## Phase 9: Client Demo Script

Use this talking track during a client demonstration:

1. "The client owns the source code in their GitHub account."
2. "The platform checks out source only inside the client-controlled pipeline runtime."
3. "The Devops Pipeline builds the Angular app, creates a Docker image, pushes it to ECR, and deploys it to DEV or QA."
4. "The Test Devops Pipeline validates the deployed QA URL using Selenium UI automation."
5. "Results are stored in the client's S3 artifact bucket and visible through Jenkins."
6. "The client can run this for multiple branches and engineers because each pipeline run is parameterized by repo, branch, environment, namespace, and target URL."

## Acceptance Criteria

The end-to-end test is successful when:

- Angular source checkout succeeds.
- Angular production build succeeds.
- Docker image is built and pushed to ECR.
- `image.json` is created.
- `templateconfiguration.json` is created.
- DEV deployment succeeds.
- QA deployment succeeds.
- QA app URL returns HTTP `200`.
- Test Devops Pipeline runs Selenium against QA URL.
- Selenium tests pass.
- Jenkins archives Selenium reports.
- S3 contains Selenium test artifacts.
- Evidence tracker is completed with actual results and comments.

## Common Issues And Fixes

| Issue | Likely Cause | Fix |
|---|---|---|
| Product UI blank page | Frontend static bundle or ingress rewrite issue | Validate `/pipeline/` returns HTML and JS assets return `200` |
| Jenkins cannot clone repo | Missing GitHub credential or repo permission | Update Jenkins credential and repo access |
| Angular build fails | Dependency or Node version mismatch | Check `package.json`, lock file, and Jenkins Node runtime |
| Docker push fails | ECR auth or IAM issue | Validate `aws ecr get-login-password` and push permissions |
| Deployment fails | Wrong cluster, namespace, or kubeconfig | Validate environment resolver and namespace |
| Selenium cannot open app | Wrong `TARGET_APP_URL` or route not public | Curl QA app URL from Jenkins agent or pod |
| Playwright browser missing | Browser not installed in Jenkins workspace | Jenkins should run `npx playwright install chromium` |
| Reports not in S3 | Artifact bucket or AWS permissions issue | Check Jenkins S3 upload logs and IAM role |

## Final Deliverables

At the end of the test, the teammate should provide:

- Completed Excel evidence tracker.
- Jenkins build URLs for DEV, QA, and Selenium test pipeline.
- DEV application URL.
- QA application URL.
- ECR image URI and digest.
- S3 paths for build artifacts and Selenium reports.
- Screenshots of:
  - Product request submission
  - Jenkins successful build
  - Running QA Angular app
  - Selenium report summary

