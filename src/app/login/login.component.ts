import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user: any;  // This will hold the user profile data
  isLoggedIn: boolean = false;  // To track the login status
  constructor(private oauthService: OAuthService) {}
  ngOnInit(): void {
    this.checkLoginStatus();
  }
  checkLoginStatus() {
    if (this.oauthService.hasValidAccessToken()) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }
  login() {
    // Start the login flow
    this.oauthService.initLoginFlow();
  }

  logout() {
    // Log the user out and clear the session
    this.oauthService.logOut();
  }
}
