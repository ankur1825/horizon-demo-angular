const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;
const publicDir = path.join(__dirname, '..', 'public');

app.use(express.json());

const release = {
  application: 'horizon-demo-angular',
  environment: process.env.APP_ENV || 'QA',
  version: process.env.APP_VERSION || '1.0.0',
  image: process.env.IMAGE_TAG || 'qa-candidate',
  status: 'Healthy',
  owner: 'acme-fintech',
  lastChecked: new Date().toISOString()
};

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'UP',
    service: 'horizon-demo-angular-api',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/release', (_req, res) => {
  res.json(release);
});

app.get('/api/quality-gates', (_req, res) => {
  res.json({
    project: release.application,
    environment: release.environment,
    gates: [
      { name: 'unit-tests', status: 'PASSED', required: true },
      { name: 'container-scan', status: 'PASSED', required: true },
      { name: 'policy-validation', status: 'PASSED', required: true },
      { name: 'qa-signoff', status: 'PENDING', required: true }
    ]
  });
});

app.post('/api/signoff', (req, res) => {
  const { requester, suite } = req.body || {};
  if (!requester || !String(requester).includes('@')) {
    return res.status(400).json({
      code: 'INVALID_REQUESTER',
      message: 'requester must be a valid email address'
    });
  }
  if (!suite) {
    return res.status(400).json({
      code: 'MISSING_SUITE',
      message: 'suite is required'
    });
  }
  res.status(201).json({
    id: `signoff-${Date.now()}`,
    requester,
    suite,
    status: 'SUBMITTED',
    environment: release.environment
  });
});

app.use(express.static(publicDir));

app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`horizon-demo-angular serving UI and API on ${port}`);
});
