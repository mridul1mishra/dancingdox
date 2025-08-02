import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Project } from '../../../service/project.interface.service';
import { DataService } from '../../../service/data.service';




@Component({
  selector: 'app-projectcard',
  imports: [CommonModule,RouterModule],
  templateUrl: './projectcard.component.html',
  styleUrl: './projectcard.component.css'
})
export class ProjectcardComponent {
  @Input() project!: Project;
  showModal = false;
  constructor(private router: Router, private dataService: DataService){}
  editProject(){
    this.router.navigate([`/editproject/${this.project.ID}`]);
  }
  confirmDelete() {
    console.log(this.project.host);
    if (confirm('Are you sure you want to delete?')) {
    this.dataService.deleteProjects(this.project.ID, this.project.host).subscribe({
      next: () => {
        alert('Project deleted successfully');
        this.router.navigate(['/dashboard'])
      },
      error: err => {
        console.error('Delete project failed:', err);
        alert('Failed to delete project');
      }
    });
  }
  }
}
