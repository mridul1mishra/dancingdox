import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Project } from '../../../service/project.interface.service';




@Component({
  selector: 'app-projectcard',
  imports: [CommonModule,RouterModule],
  templateUrl: './projectcard.component.html',
  styleUrl: './projectcard.component.css'
})
export class ProjectcardComponent {
  @Input() project!: Project;
  showModal = false;
  constructor(private router: Router){}
  editProject(){
    this.router.navigate([`/editproject/${this.project.id}`]);
  }
  confirmDelete() {
    // your delete logic or confirmation popup
    console.log('Delete project:', this.project.id);
    this.showModal = false;
  }
}
