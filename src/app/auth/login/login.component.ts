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
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    // Optionally, check if a token exists in localStorage
    if (localStorage.getItem('authToken')) {
      this.isLoggedIn = true;
    }
  }
  onLogin() {
    const credentials = { email: this.email, password: this.password };
    console.log('Sending credentials:', credentials);
    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Save token in localStorage (or sessionStorage)
        localStorage.setItem('authToken', response.token);
  
        // Set logged-in state
        this.isLoggedIn = true;
  
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
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
