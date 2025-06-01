// email.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmailService {
  constructor(private http: HttpClient) {}

  sendEmail(to: string, subject: string, body: string) {
    return this.http.post('https://www.dashdoxs.com/api/send-email', { to, subject, body });
  }
  sendOtp(to: string, otp:string){
    console.log('sendotp', otp, to);
    return this.http.post('https://www.dashdoxs.com/api/verify-otp', {to, otp});
  }
  quoteEmail(to: string, subject1: string, body1: string) {
    return this.http.post('https://www.dashdoxs.com/api/send-quote', { to, subject1, body1 });
  }
  resetEmail(to: string) {
    return this.http.post('https://www.dashdoxs.com/api/reset-link', { to });
  }

  
}
