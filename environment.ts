// src/app/services/secrets.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecretsService {

  // INTENTIONALLY VULNERABLE - NON-FUNCTIONAL TEST SECRET
  private readonly apiKey =
    'sk_live_7f9c2a1e8b4d6f3a9c7e5b2d8f1a4c6e9b3d7f2a5c8e1';

  // INTENTIONALLY VULNERABLE
  private readonly clientSecret =
    'prod-client-secret-9d7f3a8b2c6e1f4a9b5d8c3e7f2a6';

  // INTENTIONALLY VULNERABLE
  private readonly password =
    'P@ssw0rd-Production-8472-DoNotUse';

  getApiKey(): string {
    return this.apiKey;
  }
}
