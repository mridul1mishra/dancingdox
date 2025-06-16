import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../service/email.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  isFocused: boolean = false;
  showPassword: boolean = false;
  password: string = '';
  otp: string = '';
loginError: string = '';
showForgotPassword = false;
message = ''; 
emailSent: boolean = false;
  constructor(private authService: AuthService, private router: Router, private emailservice: EmailService) {}
  ngOnInit(): void {
    // Optionally, check if a token exists in localStorage
    if (localStorage.getItem('authToken')) {
      localStorage.setItem('isLoggedIn', 'true');
    }
  }
  onInputChange() {
  this.loginError = '';
}
  onLogin(form: NgForm) {
    const credentials = { email: this.email, password: this.password };
    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Save token in localStorage (or sessionStorage)
        console.log(response);
        localStorage.setItem('authData', response.token);
        localStorage.setItem('userID', this.email);
        // Set logged-in state
        localStorage.setItem('isLoggedIn', 'true');
        console.log('authservice tested redirect');
        // Navigate to another page (e.g., dashboard)
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.loginError = error.error?.message
        setTimeout(() => {this.loginError = '';}, 5000);
        // Handle error (e.g., show error message)
      }
    });
  }
  onForgotPassword(form: NgForm): void {
    console.log('onforgotpassword');
    localStorage.setItem('otpData', JSON.stringify({
      email: this.email
    }));
    this.emailservice.sendEmail(this.email,'OTP', 'OTP')
      .subscribe({
      next: () => this.emailSent = true,
      error: () => this.message = 'Something went wrong. Try again.'
      });
  }
  onLogout() {
    // Remove token from localStorage (or sessionStorage)
    localStorage.removeItem('authToken');
    localStorage.setItem('isLoggedIn', 'false');
    this.router.navigate(['/login']);
  }
  sendOtp(){
    if (this.otp) {
      const stored = localStorage.getItem('otpData');
      if (!stored) {
        alert('No email found. Please try again.');
        return;
      }
      const otpData = JSON.parse(stored);
      this.emailservice.sendOtp(otpData.email, this.otp, "true").subscribe({
        next: (res:any) => {
          this.loginError = 'OTP Verified'
          if (res.token) {
          this.router.navigate(['/reset-password'], { queryParams: { token: res.token } });
          } else {
          this.router.navigate(['/sign-in']);
          }
        },
        error: err => {console.log('Failed:', err.message);this.loginError = 'Invalid OTP'; }
        
      });
      
    } else {
      alert('Please enter the OTP.');
    }
  }
togglePassword(){
  this.showPassword = !this.showPassword;
}
  goToRegister() {
    window.location.href = 'http://www.dashdoxs.com/register';
  }
}
