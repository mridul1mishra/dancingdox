import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavigationComponent } from './navigation/top-navigation/top-navigation.component';
import { SideNavigationComponent } from "./navigation/side-navigation/side-navigation.component";
import { RightNavigationComponent } from "./navigation/right-navigation/right-navigation.component";
import { ReactiveFormsModule } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopNavigationComponent, SideNavigationComponent, RightNavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-angular-app';
  userData: any;

  constructor(private oauthService: OAuthService) {
    this.configureOAuth();
  }
  
  configureOAuth() {
    this.oauthService.configure(authConfig);
  this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
    if (this.oauthService.hasValidAccessToken()) {
      this.loadUserData();
    } else {
      this.oauthService.initLoginFlow(); // triggers login
    }
  });
    
    
  }
  

  loadUserData() {
    // Get the user's identity claims after login
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      this.userData = claims;
    }
  }
}
