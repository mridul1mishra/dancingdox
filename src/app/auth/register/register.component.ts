import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../service/email.service';


@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  submitted: boolean = false;
  email: string = '';
  password: string = '';
  firstname: string = '';
  lastname: string = '';
  designation: string = '';
  organization: string =''; 
  otp: string = '';
  currentStep = 1;
  confirmPassword: string = '';
  name: string = '';
  step: string | null = null;
  acceptedTerms: boolean = false;
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

    const newUser = { email: this.email, password: this.password, firstname: this.firstname, lastname: this.lastname, designation: this.designation, organization: this.organization  };
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
  completeStep1(form: NgForm) {
    if (form.valid) {
      localStorage.setItem('userData', JSON.stringify({
      firstName: this.firstname,
      lastName: this.lastname,
      email: this.email,
      designation: this.designation,
      organization: this.organization
    }));
      localStorage.setItem('step1Completed', 'true');
      this.currentStep = 2;
      this.emailservice.sendEmail(this.email, 'Test Subject', 'Hello!')
      .subscribe({
       next: () => {
        console.log('Email sent!');
       },
        error: err => console.log('Failed: ' + err.message)
      });
    } else {
      Object.values(form.controls).forEach(control => control.markAsTouched());
    }
  }
  completeStep2() {
    if (this.otp) {
      const stored = JSON.parse(localStorage.getItem('userData') || '{}');
      this.emailservice.sendOtp(stored.email, this.otp).subscribe({
        next: () => {
          alert('otp verified');
          localStorage.setItem('step2Completed', 'true');
          this.currentStep = 3;
        },
        error: err => {console.log('Failed:', err.message);alert('invalid otp'); }
        
      });
      
    } else {
      alert('Please enter the OTP.');
    }
  }
  completeStep3() {
    this.submitted = true;
    const valid =
    this.acceptedTerms &&
    this.password === this.confirmPassword;

  if (!valid) return;
    const stored = JSON.parse(localStorage.getItem('userData') || '{}');
    const payload = {
    firstname: stored.firstName,
    lastname: stored.lastName,
    email: stored.email,
    password: this.password,
    designation: this.designation,
    organization: this.organization
    };
    console.log('payload',payload);
    this.authService.register(payload).subscribe({
      next: (res) => {
        alert( 'Registration successful!');
        localStorage.setItem('token', res.token )
        console.log(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert(err.error?.message || 'Registration failed.');
      },
    });
  }
  resendOtp() {
    this.emailservice.resendOtpEmail(this.email, 'subject', 'body').subscribe({
    next: () => {
      alert(`OTP has been resent to your email ${this.email}`);
    },
    error: () => {
      console.log('Failed to resend OTP. Please try again.');
    }
  });
  }
}
