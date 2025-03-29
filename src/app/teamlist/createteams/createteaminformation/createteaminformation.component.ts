import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createteaminformation',
  imports: [FormsModule],
  templateUrl: './createteaminformation.component.html',
  styleUrl: './createteaminformation.component.css'
})
export class CreateteaminformationComponent {
  teamName: string = 'The Scholarly Discourse and Presentation Alliance';
  teamType: string = 'Research';
  teamDetails: string = 'Develop innovative solutions, and contribute to the advancement of knowledge in their respective fields.';

  teamTypes = ['Research', 'Development', 'Marketing', 'Design'];
  onCancel() {
    console.log('Cancelled');
  }
  constructor(private router: Router) {}
  onNext() {
    console.log('Next button clicked');
    this.router.navigate(['/teams/team-details']);
    console.log({
      teamName: this.teamName,
      teamType: this.teamType,
      teamDetails: this.teamDetails
    });
  }
}
