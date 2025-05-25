// email.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmailService {
  constructor(private http: HttpClient) {}

  sendEmail(to: string, subject: string, body: string) {
    return this.http.post('http://157.245.87.25:3000/api/send-email', { to, subject, body });
  }
  sendOtp(to: string, otp:string){
    console.log('sendotp', otp, to);
    return this.http.post('http://157.245.87.25:3000/api/verify-otp', {to, otp});
  }
  quoteEmail(to: string, subject1: string, body1: string) {
    return this.http.post('http://157.245.87.25:3000/api/send-quote', { to, subject1, body1 });
  }
  
}
