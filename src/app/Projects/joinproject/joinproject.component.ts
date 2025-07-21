import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../service/data.service';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { Project } from '../../service/project.interface.service';
import { Router } from '@angular/router';
import { UserProfile } from '../../service/document.interface.service';

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
  user: UserProfile  | null = null;
  projectId: number | null = null;
  constructor(private dataService: DataService, private authService: AuthService,private router: Router) {}
  ngOnInit(): void {
    this.user = this.authService.getUserProfile();

  }

searchProject(){
  if(this.projectId!=null)
  {
    this.dataService.getProjectById(this.projectId).subscribe(project => {
      this.project = project;
      this.projectFound = true;
      if (this.project.Collaborator){
      console.log("Collaborator data:", this.project.Collaborator);
      if (typeof this.project.Collaborator === 'string') {
      try {
        this.project.Collaborator = JSON.parse(this.project.Collaborator);
      } catch (e) {
        console.warn('Invalid Collaborator format:', this.project.Collaborator);
        this.project.Collaborator = [];
      }
      }
      }
    const alreadyExists = this.project.Collaborator?.some(
    (collab: any) => collab.email?.trim().toLowerCase() === this.user?.email?.trim().toLowerCase()
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
  const updatedcollaborator = {
  collaborators: [
    { firstname: this.user?.firstName, lastname: this.user?.lastName, email: this.user?.email }
  ],
  projectId: this.projectId
};
console.log('joinproject',this.projectId);
      if (updatedcollaborator) {
      console.log('collaborator',updatedcollaborator);
      this.dataService.updateProjectCollab(updatedcollaborator).subscribe(() => {
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
