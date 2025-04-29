import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  name: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    const newUser = { email: this.email, password: this.password, name: this.name };
    console.log('Registering user:', newUser);

    this.authService.register(newUser).subscribe({
      next: (response) => {        
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Registration failed', error);
      }
    });
  }
}
