import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavigationComponent } from './navigation/top-navigation/top-navigation.component';
import { SideNavigationComponent } from "./navigation/side-navigation/side-navigation.component";
import { RightNavigationComponent } from "./navigation/right-navigation/right-navigation.component";
import { ReactiveFormsModule } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { NgxStripeModule } from 'ngx-stripe';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-angular-app';


  
}
