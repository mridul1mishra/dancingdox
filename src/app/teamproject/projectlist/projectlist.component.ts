import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectcardComponent } from './projectcard/projectcard.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { Project } from '../../service/project.interface.service';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-projectlist',
  imports: [CommonModule, ProjectcardComponent, RouterModule],
  templateUrl: './projectlist.component.html',
  styleUrl: './projectlist.component.css'
})
export class ProjectlistComponent implements OnInit {
  constructor(private router: Router,private dataService: DataService,private authService: AuthService) {}
  projectsSubject = new BehaviorSubject<Project[]>([]); 
  projects$ = this.projectsSubject.asObservable();
  selectedStatus$ = new BehaviorSubject<string>('active');
  
  filteredProjects$: Observable<Project[]> = new Observable<Project[]>();

  ngOnInit(): void {
    this.filteredProjects$ = combineLatest([
  this.projects$,
  this.selectedStatus$
]).pipe(
  map(([projects, status]: [Project[], string]) => {
  return status === 'all'
    ? projects
    : projects.filter(p =>
        p.status?.trim().toLowerCase() === status.trim().toLowerCase()
      );
})
);
    
    // Fetching all projects from the service
    this.dataService.getAllProjects().subscribe((projects: Project[] | undefined) => 
    {
      if (projects && projects.length > 0) 
      {
        const rawEmail = localStorage.getItem('userID');
        if (!rawEmail) return;
        const currentUsername = rawEmail.trim().toLowerCase()
        const ownedProjects = projects.filter(
          project => 
            this.isOwnedOrCollaboratedProject(project, currentUsername)
        );
        this.projectsSubject.next(ownedProjects);
      }
    });
}
isOwnedOrCollaboratedProject(project: any, currentUsername: string): boolean {
  const hostMatch = project.Host?.trim().toLowerCase() === currentUsername;

  let collaborators: any[] = [];

  // Parse if collaborator is a string
  if (typeof project.Collaborator === 'string') {
    try {
      collaborators = JSON.parse(project.Collaborator);
    } catch (err) {
      console.warn('Invalid Collaborator format:', project.Collaborator);
    }
  } else if (Array.isArray(project.Collaborator)) {
    collaborators = project.Collaborator;
  }

  const collaboratorMatch = collaborators.some(collab => {
    const email =
      collab.email?.trim().toLowerCase() ||
      collab.collabemail?.trim().toLowerCase();
    return email === currentUsername;
  });

  return (hostMatch || collaboratorMatch) && project.Role.includes('Owner');
} 
  createNewProject(){
    this.router.navigate(['createproject']);
  }
  selectStatus(status: string) {
  this.selectedStatus$.next(status.trim().toLowerCase());
  }
}
