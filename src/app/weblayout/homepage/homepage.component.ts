import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EmailService } from '../../service/email.service';
import { ExtraOptions, RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [FormsModule, CommonModule,RouterModule ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})


export class HomepageComponent {
  email: string = '';
  phone: string = '';
  constructor(private emailservice: EmailService){}
getquote(form: NgForm){
if (form.valid) {
  this.emailservice.quoteEmail(this.email, 'Get Quote', 'Thankyou for contacting ')
      .subscribe({
       next: () => {
        console.log('Email sent!');
       },
        error: err => console.log('Failed: ' + err.message)
      });
}else {
      Object.values(form.controls).forEach(control => control.markAsTouched());
    }
}
scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
}
