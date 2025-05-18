import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register-step2',
  imports: [CommonModule,FormsModule],
  templateUrl: './register-step2.component.html',
  styleUrl: './register-step2.component.css'
})
export class RegisterStep2Component {
formData = {
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  };
constructor(private http: HttpClient, private authService: AuthService) {}
onSubmit() {
    console.log(this.formData.password);
    const payload = {
      email: 'mridul1mishra@gmail.com',
      password: this.formData.password,
      name: 'mridul'
    };
    this.authService.register(payload).subscribe({
      next: (res) => {
        alert(res.message || 'Registration successful!');
      },
      error: (err) => {
        alert(err.error?.message || 'Registration failed.');
      },
    });
  }
}
