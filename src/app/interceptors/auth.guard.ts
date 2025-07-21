import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { UserProfile } from '../service/document.interface.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  userProfile!: UserProfile | null;
  constructor(private authService: AuthService, private router: Router) {}
canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    return this.canActivate(childRoute, state); // Reuse logic
  }
  canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isLoggedIn = this.authService.isLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate(['/sign-in']);
      return false;
    }
    const profileId = localStorage.getItem('userID');
    const userData = localStorage.getItem('userData');
    if(!userData)
    {
      if (profileId) {
        this.authService.getUserName(profileId).subscribe({
          next: (res: UserProfile) => {
          this.userProfile = res;
          localStorage.setItem('userData', JSON.stringify(res));
          },error: (err) => {
          console.error('Failed to fetch user profile', err);
          this.userProfile = null;
          }
        });
      }
    }else{
      this.userProfile = JSON.parse(userData);
    } 
    return true;
  }
}
