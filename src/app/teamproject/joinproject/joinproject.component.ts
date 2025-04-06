import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-joinproject',
  imports: [CommonModule, FormsModule],
  templateUrl: './joinproject.component.html',
  styleUrl: './joinproject.component.css'
})
export class JoinprojectComponent {
  projectId: string = '';

  searchProject() {
    if (this.projectId.length !== 9) {
      alert('Please enter a valid 9-digit Project ID');
      return;
    }
    console.log(`Searching for project: ${this.projectId}`);
    // Here, you would typically call an API to search for the project by ID
  }
}
