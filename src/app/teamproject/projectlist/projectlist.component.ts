import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectcardComponent } from './projectcard/projectcard.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ProjectService } from '../../service/project.service';
import { Project } from '../../service/project.interface.service';

@Component({
  selector: 'app-projectlist',
  imports: [CommonModule, ProjectcardComponent, RouterModule],
  templateUrl: './projectlist.component.html',
  styleUrl: './projectlist.component.css'
})
export class ProjectlistComponent implements OnInit {
  constructor(private router: Router,private projectService: ProjectService) {}
  
  projects: Project[] = [];

  ngOnInit(): void {
    // Fetching all projects from the service
    this.projects = this.projectService.getProjects();
  }
  createNewProject(){
    this.router.navigate(['project/createindependentproject']);
  }
}
