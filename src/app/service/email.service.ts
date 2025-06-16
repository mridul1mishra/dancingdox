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
  resendOtpEmail(to: string, subject: string, body: string) {
    return this.http.post('https://www.dashdoxs.com/api/send-email', { to });
  }
  sendOtp(to: string, otp:string, reset?:string){
    const body: any = { to, otp };
  if (reset) {
    body.reset = reset;
  }
  console.log(body);
    return this.http.post('https://www.dashdoxs.com/api/verify-otp', body);
  }
  quoteEmail(to: string, subject1: string, body1: string) {
    return this.http.post('https://www.dashdoxs.com/api/send-quote', { to, subject1, body1 });
  }
  resetEmail(to: string) {
    return this.http.post('https://www.dashdoxs.com/api/reset-link', { to });
  }

  
}
