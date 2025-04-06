import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-navigation',
  imports: [RouterModule, CommonModule],
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.css'
})
export class SideNavigationComponent {
  isSubMenuOpen = false;
  toggleSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }
}
