import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-passwordreset',
  imports: [FormsModule, CommonModule],
  templateUrl: './passwordreset.component.html',
  styleUrl: './passwordreset.component.css'
})
export class PasswordresetComponent {
submitted: boolean = false;
acceptedTerms: boolean = false;
password: string = '';
token: string = '';
otpdata: string='';
tokenValid: boolean = false;
confirmPassword: string = '';
email: string = '';
  resetMessage: string = '';
constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];

      if (this.token) {
        this.validateToken(this.token);
      } else {
        console.log(this.email, this.token);
        
      }
    });
  }
  validateToken(token: string){
    console.log('validate token');
    this.http.post('https://www.dashdoxs.com/api/verify-reset-token', { token }).subscribe({
      next: () => this.tokenValid = true,
      error: () => this.router.navigate(['/sign-in'])
    });
  }  
passwordReset() {
    this.submitted = true;
    const valid =
    this.acceptedTerms &&
    this.password === this.confirmPassword;
    const otpDataString = localStorage.getItem('otpData');
    if (otpDataString !== null) {
      this.email = JSON.parse(otpDataString).email;
    }
    if (!valid) return;
    const payload = {
    email: this.email,
    password: this.password
    };
    this.authService.updatePassword(payload).subscribe({
      next: (res) => {
        this.resetMessage = 'Password reset successful! Redirecting...';
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000); // Show message briefly before redirecting
      },
      error: (err) => {
        alert(err.error?.message || 'Password Reset failed.');
      },
    });

  }
}
