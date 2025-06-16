import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { UserProfileService } from '../../service/profile.service';
import { UserProfile } from '../../service/document.interface.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-side-navigation',
  imports: [RouterModule, CommonModule],
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.css'
})
export class SideNavigationComponent implements OnInit {
  profile$: Observable<UserProfile | null>;
  isSubMenuOpen = false;
  constructor(private router: Router, private authService: AuthService, private userProfileService: UserProfileService){
    this.profile$ = this.userProfileService.profile$;
  }
  ngOnInit(){
    const profile = localStorage.getItem('userID');
    if(profile)
    this.authService.getUserName(profile).subscribe(res => {this.userProfileService.setProfile(res)});
  
  }
  toggleSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }
  onLogout() {
    localStorage.removeItem('authToken');
    localStorage.setItem('isLoggedIn', 'false');
    this.router.navigate(['/sign-in']);
  }
}
