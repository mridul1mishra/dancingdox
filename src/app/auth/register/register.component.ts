import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../service/email.service';

@Component({
  selector: 'app-register',
  standalone: true,
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
      localStorage.setItem('step1Completed', 'true');
      this.currentStep = 2;
      this.emailservice.sendEmail('mridul1mishra@yahoo.com', 'Test Subject', 'Hello!')
      .subscribe({
       next: () => alert('Email sent!'),
        error: err => alert('Failed: ' + err.message)
      });
    } else {
      alert('Please fill in both first and last name.');
    }
  }
  completeStep2() {
    if (this.otp) {
      localStorage.removeItem('step1Completed');
      alert('Registration complete!');
    } else {
      alert('Please enter the OTP.');
    }
  }
}
