import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserProfile } from './document.interface.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
private userProfile: UserProfile | null = null;
  private apiUrl = 'http://localhost:3000/api'; // your Node.js backend URL
  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  register(user: { email: string; password: string; firstname: string, lastname: string, designation: string, organization: string }): Observable<any> {

    return this.http.post(`${this.apiUrl}/register`, user); // adjust API URL as needed
  }

  updatePassword(user: { email: string; password: string; existingPass?: string; }): Observable<any> {
    console.log(user.existingPass);
    if(user.existingPass)
      return this.http.post(`${this.apiUrl}/update-password`, user)
    return this.http.post(`${this.apiUrl}/reset-password`, user); // adjust API URL as needed
  }
  
  getUserName(email:string):  Observable<UserProfile>{
    return this.http.get<UserProfile>(`${this.apiUrl}/get?email=${email}`);
  }
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

getUserProfile(): UserProfile | null {
  // Fallback to localStorage in case of page refresh
  if (!this.userProfile) {
    const stored = localStorage.getItem('userData');
    this.userProfile = stored ? JSON.parse(stored) : null;
  }
  return this.userProfile;
}

  
  updateUser(user: {city: string, address1: string, address2: string, postcode: string, email: string, firstName: string, lastName: string, organization: string, designation: string }): Observable<any>{
    return this.http.post(`${this.apiUrl}/update-Profile`, user); // adjust API URL as needed
  }
  
}
