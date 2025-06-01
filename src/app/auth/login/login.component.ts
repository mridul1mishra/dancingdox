import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../service/email.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
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
  onLogin(form: NgForm) {
    const credentials = { email: this.email, password: this.password };
    console.log('Sending credentials:', credentials);
    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Save token in localStorage (or sessionStorage)
        console.log(response);
        localStorage.setItem('authToken', response.token);
  
        // Set logged-in state
        localStorage.setItem('isLoggedIn', 'true');
        console.log('authservice tested redirect');
        // Navigate to another page (e.g., dashboard)
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.loginError = error.error?.message
        // Handle error (e.g., show error message)
      }
    });
  }
  onForgotPassword(form: NgForm): void {
    this.emailservice.resetEmail(this.email)
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

  goToRegister() {
    window.location.href = 'http://www.dashdoxs.com/register';
  }
}
