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
user: any;
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.user = this.authService.getUserDetails();
    if (this.user && this.user.email) {
      this.authService.getUserName(this.user.email).subscribe(
        data => {
          this.user.name = data.name;
          this.getProjectById(id);
          console.log('Updated user:', this.user);
        },
        error => {
          console.error('Failed to fetch user name', error);
        }
      );
    }
  }
  getProjectById(id: number) {
    this.dataService.getProjectById(id).subscribe((matchingProject: Project | undefined) => {
      if (matchingProject) {
         this.project = matchingProject;
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
