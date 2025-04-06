import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personalinfo',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './personalinfo.component.html',
  styleUrl: './personalinfo.component.css'
})
export class PersonalinfoComponent {
  profileForm: FormGroup;
  imageUrl: string = 'assets/default-profile.png'; // Default profile image
  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['Khinkal'],
      lastName: ['Atomadze'],
      address1: ['180 E Green St'],
      address2: ['Suit, Unit, Building'],
      city: ['Athens, Georgia'],
      postalCode: ['4610'],
      country: ['United States'],
      organization: ['University of Georgia'],
      designation: ['Professor'],
      invoiceAddress: [true]
    });
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    console.log(this.profileForm.value);
  }
}
