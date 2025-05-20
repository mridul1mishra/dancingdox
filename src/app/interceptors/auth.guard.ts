import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    return this.canActivate(childRoute, state); // Reuse logic
  }
  canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('Helow from canactivate');
    const isLoggedIn = this.authService.isLoggedIn();
    console.log(isLoggedIn);
    if (!isLoggedIn) {
      this.router.navigate(['/sign-in']);
      return false;
    }

    return true;
  }
}
