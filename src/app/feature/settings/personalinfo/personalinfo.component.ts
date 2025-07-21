import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../service/document.interface.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';


@Component({
  selector: 'app-personalinfo',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './personalinfo.component.html',
  styleUrl: './personalinfo.component.css'
})
export class PersonalinfoComponent {
  userProfile: UserProfile | null = null;
  firstName: string = '';
  lastName: string ='';
  organization: string ='';
  designation: string='';
  postcode: string='';
  city: string='';
  address2: string='';
  address1: string='';
  message: string = ''; 
  messageClass: string = '';

  constructor(private router: Router, private authservice: AuthService){}
  ngOnInit(){
    const userData = localStorage.getItem('userData');
    if(userData)
    {
      this.userProfile = JSON.parse(userData);
      if (this.userProfile) {
        this.firstName = this.userProfile.firstName || '';
        this.lastName = this.userProfile.lastName || '';
        this.designation = this.userProfile.designation || '';
        console.log(this.designation);
        this.organization = this.userProfile.organization || '';

      }
    }
    else
    {
      this.router.navigate(['/sign-in']);
    }
    
  }
  redirectProfile(){    
    this.router.navigate(['/settings']);
    
  }
  updateProfile(){    
    const payload = {city: this.city, address2: this.address2, address1: this.address1, postcode: this.postcode, firstName: this.firstName, lastName: this.lastName, organization: this.organization, designation: this.designation, email: this.userProfile?.email || ''};
      this.authservice.updateUser(payload).subscribe({
        next: () => {console.log('authservice update'); this.message = 'Update successful!'; this.messageClass = 'form-row custom-alert custom-alert-info';},
        error: () => {console.error('record not update'); this.message = 'Record not updated. Please try again.'; this.messageClass = 'custom-alert custom-alert-info';}
      });
    
  }
}
