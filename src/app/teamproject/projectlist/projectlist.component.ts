import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectcardComponent } from './projectcard/projectcard.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { Project } from '../../service/project.interface.service';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-projectlist',
  imports: [CommonModule, ProjectcardComponent, RouterModule],
  templateUrl: './projectlist.component.html',
  styleUrl: './projectlist.component.css'
})
export class ProjectlistComponent implements OnInit {
  constructor(private router: Router,private dataService: DataService,private authService: AuthService) {}
  
  projects$: Observable<Project[]> = of([]);

  ngOnInit(): void {
    const currentUsername = this.authService.getUserDetails()?.email;
    // Fetching all projects from the service
    this.dataService.getAllProjects().subscribe((projects: Project[] | undefined) => {
      if (projects && projects.length > 0) {
        const currentUsername = this.authService.getUserDetails()?.email;
        const matchingProject = projects.filter(project =>
          project.Host.trim().toLowerCase() === currentUsername?.trim().toLowerCase() &&
          project.Role.includes('Owner')
        );
        console.log('matching project', matchingProject);
        if (matchingProject) {
          this.projects$ = of(matchingProject);
        } else {
          console.warn('User is not the host of any matching project');
        }
      } else {
        console.warn('No projects found with this ID');
      }
    });
  }
  createNewProject(){
    this.router.navigate(['project/createindependentproject']);
  }
}
