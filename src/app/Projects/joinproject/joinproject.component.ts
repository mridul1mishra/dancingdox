import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../service/data.service';
import { NullValidationHandler } from 'angular-oauth2-oidc';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { Project } from '../../service/project.interface.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-joinproject',
  imports: [FormsModule, CommonModule],
  templateUrl: './joinproject.component.html',
  styleUrl: './joinproject.component.css'
})
export class JoinprojectComponent {
  projectFound: boolean = false;
  collabMessage: string ="";

  project: Project | any;
  user: any;
projectId: number | null = null;
constructor(private dataService: DataService, private authService: AuthService,private router: Router) {}
ngOnInit(): void {
    this.user = this.authService.getUserDetails();

    if (this.user && this.user.email) {
      this.authService.getUserName(this.user.email).subscribe(
        data => {
          this.user.name = data.name;
          console.log('Updated user:', this.user);
        },
        error => {
          console.error('Failed to fetch user name', error);
        }
      );
    }
  }

searchProject(){

  if(this.projectId!=null)
  {
    this.dataService.getProjectById(this.projectId).subscribe(project => {
      this.project = project;
      console.log(this.project.Collaborator);
      this.projectFound = true;
      if (typeof this.project.Collaborator === 'string') {
  try {
    this.project.Collaborator = JSON.parse(this.project.Collaborator);
  } catch (e) {
    console.warn('Invalid Collaborator format:', this.project.Collaborator);
    this.project.Collaborator = [];
  }
}
      const alreadyExists = this.project.Collaborator?.some(
    (collab: any) => collab.email?.trim().toLowerCase() === this.user.email?.trim().toLowerCase()
  );
  if (alreadyExists) {
    this.collabMessage = 'Collaborator already added.';
    this.projectFound = false;    
  }
  else{
    this.projectFound = true;
  }
    });
    
  }
}
joinProject(){
      if (this.project) {
      console.log('Found Project:', this.project.Collaborator);
      if (typeof this.project.Collaborator === 'string') {
        try {
          this.project.Collaborator = JSON.parse(this.project.Collaborator);
        } catch {
          this.project.Collaborator = [];
        }
      }
      if (!Array.isArray(this.project.Collaborator)) {
        this.project.Collaborator = [];
      }
      this.project.Collaborator.push({
        name: this.user.name,
        email: this.user.email
      });
      this.dataService.updateProject(this.project).subscribe(() => {
        console.log('Project updated successfully');
      });
      console.log('Updated collaborators:', this.project.Collaborator);
      console.log('Type of Collaborator:', typeof this.project.Collaborator);
      this.projectFound = true;
      } else {
        console.log('Project not found');
        this.projectFound = false;
      }
      this.router.navigate(['/projects', this.project.id]);
      
    }
}
