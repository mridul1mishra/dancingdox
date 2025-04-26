import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-personalinfo',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './personalinfo.component.html',
  styleUrl: './personalinfo.component.css'
})
export class PersonalinfoComponent {
  user: any;
  imageUrl: string = 'assets/default-profile.png'; // Default profile image
  constructor(private oauthService: OAuthService) {}
  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile() {
    console.log('getuserprofile');
    if (this.oauthService.hasValidAccessToken()) {
      this.oauthService.loadUserProfile().then((profile: any) => {
        this.user = profile.info;
        console.log('User Profile:', this.user);
      }).catch(error => {
        console.error('Error loading user profile:', error);
      });
    } else {
      console.log('Access token is invalid or missing');
      // Optionally trigger login flow if no valid token
      this.oauthService.initLoginFlow();
    }
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    
  }
}
