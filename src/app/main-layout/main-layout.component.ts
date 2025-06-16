import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavigationComponent } from '../navigation/top-navigation/top-navigation.component';
import { SideNavigationComponent } from '../navigation/side-navigation/side-navigation.component';
import { RightNavigationComponent } from '../navigation/right-navigation/right-navigation.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, TopNavigationComponent, SideNavigationComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
