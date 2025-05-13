import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-navigation',
  imports: [RouterModule, CommonModule],
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.css'
})
export class SideNavigationComponent {
  isSubMenuOpen = false;
  constructor(private router: Router){}
  toggleSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }
  onLogout() {
    localStorage.removeItem('authToken');
    localStorage.setItem('isLoggedIn', 'false');
    this.router.navigate(['/login']);
  }
}
