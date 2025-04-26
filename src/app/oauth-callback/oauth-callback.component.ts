// src/app/oauth-callback/oauth-callback.component.ts
import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-oauth-callback',
  template: `<h1>Processing OAuth Callback...</h1>`,
})
export class OAuthCallbackComponent {
  constructor(private oauthService: OAuthService) {
    this.oauthService.tryLoginImplicitFlow(); // This will handle the login flow
  }
}
