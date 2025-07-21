import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpdatepasswordComponent } from "./updatepassword/updatepassword.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loginsecurity',
  imports: [FormsModule, UpdatepasswordComponent,CommonModule],
  templateUrl: './loginsecurity.component.html',
  styleUrl: './loginsecurity.component.css'
})
export class LoginsecurityComponent {
isToggled: boolean = true;
showUpdatePassword: boolean = false;
onToggleChange(){}
}
