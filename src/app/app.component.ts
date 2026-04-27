import { Component } from '@angular/core';

@Component({
  selector: 'horizon-root',
  standalone: true,
  template: `
    <main class="shell">
      <section class="panel">
        <p class="eyebrow">Horizon Relevance</p>
        <h1>Angular Demo Application</h1>
        <p>
          This lightweight app validates the Angular project type in the
          DevOps Pipeline product.
        </p>
        <dl>
          <div><dt>Framework</dt><dd>Angular</dd></div>
          <div><dt>Build</dt><dd>npm run prodbuild</dd></div>
          <div><dt>Runtime</dt><dd>nginx</dd></div>
        </dl>
      </section>
    </main>
  `,
  styles: [`
    .shell {
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #f4f7fb;
      color: #172033;
      font-family: Arial, sans-serif;
    }
    .panel {
      width: min(720px, calc(100vw - 48px));
      border: 1px solid #d9e2ef;
      background: white;
      padding: 32px;
      box-shadow: 0 18px 44px rgba(23, 32, 51, 0.12);
    }
    .eyebrow {
      color: #0b6bcb;
      font-weight: 700;
      margin: 0 0 8px;
    }
    h1 {
      margin: 0 0 12px;
      font-size: 34px;
    }
    dl {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin: 24px 0 0;
    }
    dt {
      color: #5d6b82;
      font-size: 12px;
      text-transform: uppercase;
    }
    dd {
      margin: 4px 0 0;
      font-weight: 700;
    }
  `]
})
export class AppComponent {}
