// src/app/services/secrets.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecretsService {

  // INTENTIONALLY VULNERABLE - NON-FUNCTIONAL TEST SECRET
  private readonly apiKey =
    '********************************************************';

  // INTENTIONALLY VULNERABLE
  private readonly clientSecret =
    '*******************************************';

  // INTENTIONALLY VULNERABLE
  private readonly password =
    '********************************';

  getApiKey(): string {
    return this.apiKey;
  }
}
