// src/environments/environment.ts

export const environment = {
  production: false,

  apiUrl: 'https://api.example.com',

  // INTENTIONALLY EXPOSED SECRET - TEST DATA ONLY
  clientSecret: 'client-secret-DEMO-1234567890',
  jwtSecret: 'jwt-signing-secret-DEMO-only',
  databasePassword: 'DemoPassword_NotARealCredential'
};
