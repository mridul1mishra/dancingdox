import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopNavigationComponent } from './navigation/top-navigation/top-navigation.component';
import { SideNavigationComponent } from "./navigation/side-navigation/side-navigation.component";
import { RightNavigationComponent } from "./navigation/right-navigation/right-navigation.component";
import { ReactiveFormsModule } from '@angular/forms';

import { NgxStripeModule } from 'ngx-stripe';
import { AuthService } from './service/auth.service';
import { UserProfile } from './service/document.interface.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'my-angular-app';
  
  constructor(private router: Router, private authService: AuthService){}
  ngOnInit(){
    
    
  }
    

  
}
