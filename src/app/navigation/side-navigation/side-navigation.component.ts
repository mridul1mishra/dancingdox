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
  userProfile!: UserProfile | null;
  isSubMenuOpen = false;
  constructor(private router: Router, private authService: AuthService){}
  ngOnInit(){
    
    this.userProfile = this.authService.getUserProfile();
  }
  toggleSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }
  onLogout() {
    const keysToRemove = [
  'authData',
  'otpData',
  'step1Completed',
  'step2Completed',
  'userData',
  'userID',
  'Storedproject',
  'project'
];
keysToRemove.forEach(key => localStorage.removeItem(key));
localStorage.setItem('isLoggedIn', 'false');
this.router.navigate(['/sign-in']);
  }
}
