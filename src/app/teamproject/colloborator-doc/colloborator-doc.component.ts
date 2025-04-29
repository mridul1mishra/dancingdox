import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { colloboratorService } from '../../service/colloborator.service';
import { Project } from '../../service/project.interface.service';
import { NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { DataService } from '../../service/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-colloborator-doc',
  imports: [CommonModule],
  templateUrl: './colloborator-doc.component.html',
  styleUrl: './colloborator-doc.component.css'
})
export class ColloboratorDocComponent {
  
  projects: Project[] | undefined;
    constructor(private collabService: colloboratorService,private route: ActivatedRoute,private authService: AuthService,private dataService: DataService) {}
    ngOnInit(): void {
      const id = Number(this.route.snapshot.paramMap.get('id'));
    
      this.getProjectById(id);     
    }
    getProjectById(id: number): void {
      this.dataService.getProjectById(id).subscribe((projects: Project[] | undefined) => {
        if (projects && projects.length > 0) {
          const currentUsername = this.authService.getUserDetails()?.email;
    
          const matchingProject = projects.filter(project =>
            project.Host.includes(currentUsername)
          );
    
          if (matchingProject) {
            this.projects = matchingProject;
            
          } else {
            console.warn('User is not the host of any matching project');
          }
        } else {
          console.warn('No projects found with this ID');
        }
      });
    }
}
