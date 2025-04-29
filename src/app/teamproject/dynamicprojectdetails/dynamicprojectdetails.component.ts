import { Component, OnInit } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { DataService } from '../../service/data.service';
import { Observable } from 'rxjs';
import { Project } from '../../service/project.interface.service';
import { CommonModule } from '@angular/common';
import { ColloboratorDocComponent } from "../colloborator-doc/colloborator-doc.component";
import { RequiredDocComponent } from "../required-doc/required-doc.component";
import { AuthService } from '../../service/auth.service';
export const recentUploads = [
  { id:1, name: 'Jillur Rahman', file: 'National Identity Card24.pdf', time: '12:41 AM 12 Oct, 2025' },
  { id:1, name: 'Kalam Nil', file: 'National Identity Card24.pdf', time: '11:30 AM 12 Oct, 2025' },
  { id:1, name: 'Aklima Fahid', file: 'Abstract.pdf', time: '08:41 PM 10 Oct, 2025' },
  { id:2, name: 'Rofik Kalam', file: 'Research proposal.doc', time: '10:41 AM 11 Oct, 2025' },
  { id:2, name: 'Sujon Abid', file: 'Research proposal.doc', time: '10:41 AM 11 Oct, 2025' }
];
@Component({
  selector: 'app-dynamicprojectdetails',
  imports: [CommonModule, ColloboratorDocComponent, RequiredDocComponent],
  templateUrl: './dynamicprojectdetails.component.html',
  styleUrl: './dynamicprojectdetails.component.css'
})
export class DynamicprojectdetailsComponent {
constructor(private route: ActivatedRoute,private authService: AuthService,private dataService: DataService) {}
project?: Project;
recentuploads: any[] = [];
recentupload = recentUploads;
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.getProjectById(id);
    this.recentuploads = recentUploads.filter(item => item.id === id);
  }
  getProjectById(id: number) {
    this.dataService.getProjectById(id).subscribe((projects: Project[] | undefined) => {
      if (projects && projects.length > 0) {
        const currentUsername = this.authService.getUserDetails()?.email;
        
        console.log('Projects:', projects);
      
        const matchingProject = projects.find(project =>
          project.Host.trim().toLowerCase() === currentUsername?.trim().toLowerCase()
        );
  
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
