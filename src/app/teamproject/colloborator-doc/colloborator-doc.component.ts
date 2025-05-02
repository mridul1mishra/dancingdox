import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { colloboratorService } from '../../service/colloborator.service';
import { DocumentMetadata, Project, ProjectWithDocuments } from '../../service/project.interface.service';
import { NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { DataService } from '../../service/data.service';
import { Observable, of } from 'rxjs';
import { TestcomponentComponent } from "../../testcomponent/testcomponent.component";

@Component({
  selector: 'app-colloborator-doc',
  imports: [CommonModule, TestcomponentComponent],
  templateUrl: './colloborator-doc.component.html',
  styleUrl: './colloborator-doc.component.css'
})
export class ColloboratorDocComponent {
  showModal = false;
  collaboratorName: string | undefined;
  collaboratorImage: string | undefined;
  projects$: Observable<Project[]> = of([]);
    constructor(private collabService: colloboratorService,private route: ActivatedRoute,private authService: AuthService,private dataService: DataService) {}
    ngOnInit(): void {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      const user = this.authService.getUserDetails();
      console.log('user details',user);
      if (user?.email) {
        this.authService.getUserName(user.email).subscribe(data => {
          this.collaboratorName = data.name;
          this.collaboratorImage = data.image;
        });
      }
      this.getProjectById(id);     
    }
    
    Modalbox()
    {
      this.showModal = true;
    }
    closeModal() {
      this.showModal = false;
    }
    getProjectById(id: number): void {
      this.dataService.getProjectById(id).subscribe((projects: Project[] | undefined) => {
        if (projects && projects.length > 0) {
          const currentUsername = this.authService.getUserDetails()?.email;
          const matchingProjects = projects.filter(project =>
            project.Host.trim().toLowerCase() === currentUsername?.trim().toLowerCase()
          );
          const transformedProjects: ProjectWithDocuments[] = matchingProjects.map( project => {
            const documentNames = project.documents.map(doc => doc.filename).join(', ');
            return {
              ...project,
              documentNamesString: documentNames, // add a new property
            };
          });
          this.projects$ = of(transformedProjects);
        } else {
          console.warn('No projects found with this ID');
        }
      });
    }
}
