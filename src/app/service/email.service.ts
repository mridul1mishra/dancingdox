// email.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EmailService {
  constructor(private http: HttpClient) {}

  sendEmail(to: string, subject: string, body: string) {
    return this.http.post('http://localhost:3000/send-email', { to, subject, body });
  }
}
