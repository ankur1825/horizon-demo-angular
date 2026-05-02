import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type PipelineStatus = 'Healthy' | 'Warning' | 'Blocked';

interface Deployment {
  environment: string;
  version: string;
  image: string;
  status: PipelineStatus;
  lastChecked: string;
}

@Component({
  selector: 'horizon-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="shell">
      <nav class="topbar" aria-label="Primary">
        <strong>Horizon Demo Angular</strong>
        <span>Client QA Portal</span>
      </nav>

      <section class="hero">
        <div>
          <p class="eyebrow">AI DevSecOps validation</p>
          <h1>Release evidence for a deployed Angular workload</h1>
          <p class="lede">
            QA can verify a live application endpoint, review promotion metadata,
            and confirm that deployment controls are working before production.
          </p>
        </div>
        <aside class="health-card" aria-label="Current QA health">
          <span class="status-dot"></span>
          <p>QA environment</p>
          <strong data-testid="qa-status">{{ qaDeployment.status }}</strong>
          <small>Image {{ qaDeployment.image }}</small>
        </aside>
      </section>

      <section class="grid">
        <article class="panel">
          <div class="panel-title">
            <h2>Deployment Snapshot</h2>
            <span data-testid="release-version">{{ qaDeployment.version }}</span>
          </div>
          <dl class="snapshot">
            <div>
              <dt>Environment</dt>
              <dd>{{ qaDeployment.environment }}</dd>
            </div>
            <div>
              <dt>Image</dt>
              <dd>{{ qaDeployment.image }}</dd>
            </div>
            <div>
              <dt>Last Checked</dt>
              <dd>{{ qaDeployment.lastChecked }}</dd>
            </div>
          </dl>
        </article>

        <article class="panel">
          <h2>Quality Gates</h2>
          <ul class="gate-list">
            <li><span class="pass"></span> Unit tests passed</li>
            <li><span class="pass"></span> Container scan reviewed</li>
            <li><span class="pass"></span> Policy checks passed</li>
            <li><span class="warn"></span> Manual QA signoff pending</li>
          </ul>
        </article>
      </section>

      <section class="panel request-panel">
        <div>
          <h2>QA Signoff Request</h2>
          <p>Submit a release validation request after the QA smoke test completes.</p>
        </div>

        <form (ngSubmit)="submitRequest()" aria-label="QA signoff request">
          <label>
            Requester
            <input
              name="requester"
              [(ngModel)]="requester"
              data-testid="requester-input"
              placeholder="qa.engineer@client.com"
              required
            />
          </label>

          <label>
            Test Suite
            <select name="suite" [(ngModel)]="suite" data-testid="suite-select">
              <option>Smoke</option>
              <option>Regression</option>
              <option>Accessibility</option>
            </select>
          </label>

          <button type="submit" data-testid="submit-signoff">Submit Signoff</button>
        </form>

        <p
          class="toast"
          data-testid="success-message"
          role="status"
          *ngIf="submitted"
        >
          QA signoff request submitted for {{ suite }} by {{ requester }}.
        </p>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f5f7fb;
      color: #172033;
      font-family: Arial, Helvetica, sans-serif;
    }

    .shell {
      width: min(1120px, calc(100vw - 40px));
      margin: 0 auto;
      padding: 24px 0 48px;
    }

    .topbar {
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #d9e2ef;
      color: #31415c;
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 28px;
      align-items: end;
      padding: 48px 0 28px;
    }

    .eyebrow {
      margin: 0 0 8px;
      color: #0b6bcb;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 12px;
    }

    h1, h2, p {
      margin-top: 0;
    }

    h1 {
      max-width: 760px;
      margin-bottom: 14px;
      font-size: 42px;
      line-height: 1.08;
    }

    h2 {
      margin-bottom: 16px;
      font-size: 20px;
    }

    .lede {
      max-width: 680px;
      color: #526178;
      font-size: 17px;
      line-height: 1.55;
    }

    .panel, .health-card {
      border: 1px solid #d9e2ef;
      background: white;
      box-shadow: 0 12px 30px rgba(23, 32, 51, 0.08);
      border-radius: 8px;
      padding: 24px;
    }

    .health-card {
      min-height: 180px;
    }

    .health-card p {
      color: #526178;
      margin-bottom: 8px;
    }

    .health-card strong {
      display: block;
      font-size: 34px;
      margin-bottom: 10px;
    }

    .health-card small {
      color: #526178;
    }

    .status-dot, .pass, .warn {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 999px;
    }

    .status-dot, .pass {
      background: #1f9d55;
    }

    .warn {
      background: #d9822b;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .panel-title {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
    }

    .panel-title span {
      color: #0b6bcb;
      font-weight: 700;
    }

    .snapshot {
      display: grid;
      gap: 14px;
      margin: 0;
    }

    dt {
      color: #6a778d;
      font-size: 12px;
      text-transform: uppercase;
    }

    dd {
      margin: 4px 0 0;
      font-weight: 700;
    }

    .gate-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 12px;
    }

    .gate-list li {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .request-panel {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 28px;
      align-items: flex-start;
    }

    form {
      display: grid;
      grid-template-columns: 1fr 180px auto;
      gap: 14px;
      align-items: end;
    }

    label {
      display: grid;
      gap: 6px;
      color: #526178;
      font-size: 13px;
      font-weight: 700;
    }

    input, select {
      height: 42px;
      border: 1px solid #bfcbda;
      border-radius: 6px;
      padding: 0 12px;
      color: #172033;
      background: white;
      font-size: 14px;
    }

    button {
      height: 42px;
      border: 0;
      border-radius: 6px;
      padding: 0 18px;
      background: #0b6bcb;
      color: white;
      font-weight: 700;
      cursor: pointer;
    }

    .toast {
      grid-column: 2;
      margin: 14px 0 0;
      border: 1px solid #9dd6b0;
      background: #edf9f0;
      color: #1d6b39;
      border-radius: 6px;
      padding: 12px 14px;
      font-weight: 700;
    }

    @media (max-width: 820px) {
      .hero, .grid, .request-panel, form {
        grid-template-columns: 1fr;
      }

      h1 {
        font-size: 32px;
      }

      .toast {
        grid-column: auto;
      }
    }
  `]
})
export class AppComponent {
  qaDeployment: Deployment = {
    environment: 'QA',
    version: 'release-2026.05',
    image: 'horizon-demo-angular:qa',
    status: 'Healthy',
    lastChecked: 'Automated smoke test ready'
  };

  requester = '';
  suite = 'Smoke';
  submitted = false;

  submitRequest(): void {
    if (!this.requester.trim()) {
      return;
    }
    this.submitted = true;
  }
}
