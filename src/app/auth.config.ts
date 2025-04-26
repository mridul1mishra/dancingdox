import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com', // or your auth server
  redirectUri: window.location.origin,
  clientId: '1059263429013-ha0gm4u0qa0pk9uleivtkb8g8k97p28a.apps.googleusercontent.com',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true,
  dummyClientSecret: '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',
  strictDiscoveryDocumentValidation: false,
  userinfoEndpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',  // Set UserInfo endpoint directly
  tokenEndpoint: 'https://oauth2.googleapis.com/token',  // Set token endpoint directly
  logoutUrl: 'https://accounts.google.com/logout',  // Optional: If you need logout support
};
