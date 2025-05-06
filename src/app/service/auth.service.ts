import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private apiUrl = 'http://localhost:3000/api'; // your Node.js backend URL
  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  register(user: { email: string; password: string; name: string }): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/register`, user); // adjust API URL as needed
  }
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
  getUserName(email:string):  Observable<{ name: string, image: string, email:string }>{
    return this.http.get<{ name: string, image: string, email: string }>(`http://localhost:3000/api/get?email=${email}`);
  }
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Decode the token
  decodeToken(token: string): any {
    if (!token) {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT Token!');
      return null;
    }

    try {
      const payload = parts[1];
      const decodedPayload = atob(payload); // decode Base64
      return JSON.parse(decodedPayload);    // parse JSON
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Public method to get user details from token
  getUserDetails(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    
    return this.decodeToken(token);
  }
}
