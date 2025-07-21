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
  allProjects: Project[] = [];
  projectsSubject = new BehaviorSubject<Project[]>([]); 
  projects$ = this.projectsSubject.asObservable();
  selectedStatus$ = new BehaviorSubject<string>('active'); // Default selected status
  
  filteredProjects$: Observable<Project[]> = new Observable<Project[]>();

  ngOnInit(): void {     
  const rawEmail = localStorage.getItem('userID');
  const currentUser = rawEmail?.trim().toLowerCase();
  // Fetch and filter owned projects
  this.dataService.getAllProjects().subscribe((projects: Project[] = []) => {
  this.allProjects = projects;
  console.log('All projects stored:', this.allProjects);

  const ownedOrCollaboratedProjects = this.allProjects.filter(project => {
    const host = project.host?.replace(/"/g, '').toLowerCase();
    if (host === currentUser) return true;

    let collaborators: { email: string }[] = [];
    if (typeof project.collaborator === 'string') {
      collaborators = JSON.parse(project.collaborator);
    } else if (Array.isArray(project.collaborator)) {
      collaborators = project.collaborator;
    }

    return collaborators.some(c => c.email?.toLowerCase() === currentUser);
  });

  this.allProjects = ownedOrCollaboratedProjects;

  // Apply initial filter for 'active'
  this.applyStatusFilter('active');
});
}
isOwnedOrCollaboratedProject(project: any, currentUsername: string): boolean {
   console.log('Checking project:', project.ID );
  console.log('Current user:', currentUsername);
  const hostEmail = project.host ?? project.Host;  // check casing/field name
  console.log('Host email:', hostEmail);

  if (!hostEmail) {
    console.warn('Project missing host field:', project);
  }
  const hostMatch = project.host?.trim().toLowerCase() === currentUsername;
console.log('Host match:', hostMatch);
  let collaborators: any[] = [];

  if (typeof project.collaborator === 'string') {
    try {
      collaborators = JSON.parse(project.collaborator);
    } catch (err) {
      collaborators = [];
    }
  } else if (Array.isArray(project.collaborator)) {
    collaborators = project.collaborator;
  }

  const collaboratorMatch = collaborators.some(collab => {
    const email = collab.email?.trim().toLowerCase() || collab.collabemail?.trim().toLowerCase();
    return email === currentUsername;
  });

  const role = (project.Role ?? project.role ?? '').toLowerCase();
  const isOwned = (hostMatch || collaboratorMatch) && role.includes('owner');

  return isOwned;
}

  createNewProject(){
    this.router.navigate(['createproject']);
  }
  applyStatusFilter(status: string): void {
  this.selectedStatus$.next(status);

  const now = new Date();

  const filtered = this.allProjects.filter(project => {
    const statusVal = project.status?.toLowerCase();
    const endDate = new Date(project.endDate);

    switch (status) {
      case 'active':
        return statusVal === 'active';
      case 'draft':
        return statusVal === 'draft';
      case 'past':
        return statusVal === 'past';
      case 'bin':
        return statusVal === 'bin';
      default:
        return false;
    }
  });

  this.filteredProjects$ = of(filtered);
}
  selectStatus(status: string) {
    console.log('select status',status);
  this.applyStatusFilter(status);
  
  }
}
