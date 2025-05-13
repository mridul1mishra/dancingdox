import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    // Optionally, check if a token exists in localStorage
    if (localStorage.getItem('authToken')) {
      localStorage.setItem('isLoggedIn', 'true');
    }
  }
  onLogin() {
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
        // Handle error (e.g., show error message)
      }
    });
  }

  onLogout() {
    // Remove token from localStorage (or sessionStorage)
    localStorage.removeItem('authToken');
    localStorage.setItem('isLoggedIn', 'false');
    this.router.navigate(['/login']);
  }

  goToRegister() {
    window.location.href = 'http://localhost:4200/register';
  }
}
