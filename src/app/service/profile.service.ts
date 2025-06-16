import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from './document.interface.service';



@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  profile$ = this.profileSubject.asObservable();

  setProfile(profile: UserProfile) {
    this.profileSubject.next(profile);
  }

  getProfile(): UserProfile | null {
    return this.profileSubject.value;
  }
}
