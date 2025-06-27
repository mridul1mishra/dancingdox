import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project } from '../../service/project.interface.service';
import { DataService } from '../../service/data.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PricingplanComponent } from "../../common/pricingplan/pricingplan.component";
import { AuthService } from '../../service/auth.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-collaborator',
  imports: [CommonModule, FormsModule, PricingplanComponent],
  templateUrl: './collaborator.component.html',
  styleUrl: './collaborator.component.css'
})
export class CollaboratorComponent {
  projects: Project[] = [];
  isSubscribed: string = '';
  showPricingPlan: boolean = false
  lastProject!: Project;
  collabCount: number = 1;
  documents: any[] = [];
  showModal = false; // Ensure this is initialized
  showDialog = false;
  constructor(private dataService: DataService,private http: HttpClient,private router: Router,private route: ActivatedRoute,private authService: AuthService) {}
  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

  confirm() {
  console.log("Checking subscription...");
  const stored = localStorage.getItem('userID') || '';

  this.authService.getUserName(stored).subscribe(data => {
  setTimeout(() => {
    this.isSubscribed = data.isSubscribed.toString();;
    console.log(this.isSubscribed);
    this.showDialog = true;

    if (!this.isSubscribed) {
      this.showPricingPlan = true;
    }
  });
});
}
  addDocuments() {
    this.showDialog = false;
    this.dataService.getAllProjects().subscribe({
      next: (data) => {
        console.log('Received Projects:', data);
        this.projects = data;  // Directly assign the received data
        this.lastProject = data[data.length - 1];  // Get the last project
        this.lastProject.collabCount = this.collabCount;
        console.log('Last Project:', this.lastProject.collabCount);
        this.http.post('https://www.dashdoxs.com/api/update-projects', this.projects)
        .subscribe({
          next: () => {
          console.log('Projects updated successfully in CSV');
          const projectId = this.lastProject.id; // Replace with correct property if different
          this.router.navigate(['/projects', projectId]);
        },
          error: (err) => console.error('Error updating CSV:', err)
        });
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
    this.router.navigate(['project/createindependentproject/project-start/collaborator/assignment/' + Number(this.route.snapshot.paramMap.get('id'))]);
    
    
  }
  
cancel() {
  this.showDialog = false;
}
goToPricing() {
  this.showDialog = false;
  this.showPricingPlan = true;
}

}
