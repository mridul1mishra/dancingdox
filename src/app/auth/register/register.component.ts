import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../service/email.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  designation: string = ''; 
  otp: string = '';
  currentStep = 1;
  confirmPassword: string = '';
  name: string = '';
  step: string | null = null;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private emailservice: EmailService) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.step = params.get('step');      
    });

  }
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
  completeStep1() {
    if (this.firstName && this.lastName) {
      localStorage.setItem('userData', JSON.stringify({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    }));
      localStorage.setItem('step1Completed', 'true');
      this.currentStep = 2;
      this.emailservice.sendEmail(this.email, 'Test Subject', 'Hello!')
      .subscribe({
       next: () => {
        alert('Email sent!');
       },
        error: err => alert('Failed: ' + err.message)
      });
    } else {
      alert('Please fill in both first and last name.');
    }
  }
  completeStep2() {
    if (this.otp) {
      const stored = JSON.parse(localStorage.getItem('userData') || '{}');
      localStorage.setItem('step2Completed', 'true');
      this.currentStep = 3;
      this.emailservice.sendOtp(stored.email, this.otp).subscribe({
        next: () => {
          alert('otp verified');
        },
        error: err => alert('Failed: ' + err.message)
      });
      
    } else {
      alert('Please enter the OTP.');
    }
  }
  completeStep3() {
    const stored = JSON.parse(localStorage.getItem('userData') || '{}');
    console.log(this.email);
    const payload = {
      name: stored.firstName + ' ' + stored.lastName,
    email: stored.email,
    password: this.password
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
