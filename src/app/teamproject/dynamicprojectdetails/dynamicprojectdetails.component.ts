import { Component, OnInit } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { DataService } from '../../service/data.service';
import { Observable } from 'rxjs';
import { Project } from '../../service/project.interface.service';
import { CommonModule } from '@angular/common';
import { ColloboratorDocComponent } from "../colloborator-doc/colloborator-doc.component";
import { RequiredDocComponent } from "../required-doc/required-doc.component";
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-dynamicprojectdetails',
  imports: [CommonModule, ColloboratorDocComponent, RequiredDocComponent],
  templateUrl: './dynamicprojectdetails.component.html',
  styleUrl: './dynamicprojectdetails.component.css'
})
export class DynamicprojectdetailsComponent {
constructor(private route: ActivatedRoute,private authService: AuthService,private dataService: DataService) {}
project?: Project;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getProjectById(id);
  }
  getProjectById(id: number) {
    this.dataService.getProjectById(id).subscribe((projects: Project[] | undefined) => {
      if (projects && projects.length > 0) {
        const currentUsername = this.authService.getUserDetails()?.email;
        
        console.log('Projectslength:', projects);
      
        const matchingProject = projects.find(project => {
          return (
            project.Host.trim().toLowerCase() === currentUsername?.trim().toLowerCase() &&
            project.Role?.toLowerCase() === 'owner'
          );
        });
        console.log('matching project',matchingProject);
        if (matchingProject) {
          this.project = matchingProject;
        } else {
          console.warn('User is not the host of any matching project');
        }
      } else {
        console.warn('No projects found with this ID');
      }
    });
  }
  getDaysLeft(endDateStr: string): number {
    const endDate = new Date(endDateStr);
    const today = new Date();
    return Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  }
  
}
