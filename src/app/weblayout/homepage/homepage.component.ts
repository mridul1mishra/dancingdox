import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EmailService } from '../../service/email.service';
import { ExtraOptions, RouterModule } from '@angular/router';


@Component({
  selector: 'app-homepage',
  imports: [FormsModule, CommonModule, RouterModule, ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})


export class HomepageComponent {
  selectedPlan: 'personal' | 'team' = 'team'; // or 'personal' as default
  email: string = '';
  phone: string = '';
  message: string = '';
  submitted = false;
  countdown: number = 10;
  countdownInterval: any;
  
  constructor(private emailservice: EmailService){}
 getquote(form: NgForm) {
    if (form.valid) {
      this.emailservice.quoteEmail(this.email, 'Get Quote', 'Thank you for contacting')
        .subscribe({
          next: () => {
            this.submitted = true;
            this.countdown = 10;

            this.countdownInterval = setInterval(() => {
              this.countdown--;
              if (this.countdown === 0) {
                clearInterval(this.countdownInterval);
                this.resetForm(form);
              }
            }, 1000);
          },
          error: err => {
            console.log('Failed: ' + err.message);
          }
        });
    } else {
      Object.values(form.controls).forEach(control => control.markAsTouched());
    }
  }

  resetForm(form: NgForm) {
    this.submitted = false;
    this.email = '';
    this.phone = '';
    this.message = '';
    form.resetForm();
  }
scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  console.log(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
scrollToTop() {
  const container = document.getElementById('pricing-plan');
  if (container) {
    console.log('Scrolling container');
    container.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
selectPlan(plan: 'personal' | 'team') {
  this.selectedPlan = plan;
}

}
