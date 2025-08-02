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
  canCreateProject: boolean = false;
  showPricingPlan: boolean = false;
  showPaymentPage: boolean = false;
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
  this.showDialog = true;
  console.log('showsubscribe',this.showPaymentPage);
  const stored = localStorage.getItem('userData') || '';
    if (stored) {
  const parsed = JSON.parse(stored); // convert string to object
  console.log('parsed.issubscribed',parsed.isSubscribed);
  this.isSubscribed = parsed.isSubscribed;
    if (parsed.isSubscribed === true) {
      this.canCreateProject = true;
      this.showPaymentPage = false;
    }
    else{
      console.log(this.showPaymentPage);      
      this.showPaymentPage = true;
      this.canCreateProject = false
    }
  }
  else{
    this.router.navigate(['/']);
  }
}
addDocuments() {
  this.showDialog = false;
  const formData = new FormData();
  const projectid = Number(this.route.snapshot.paramMap.get('id'));
  formData.append('projectId', projectid.toString());
  formData.append('collabCount', this.collabCount.toString());
  formData.append('Status', 'Active');
  this.dataService.updateProject(formData).subscribe({
    next: () => { console.log('Projects updated successfully in CSV'); this.router.navigate(['/projects', projectid]); },
    error: (err) => { console.error('Error updating CSV:', err);}
  });    
}
  
cancel() {
  this.showDialog = false;
}
goToPricing() {
  this.showDialog = false;
  this.showPricingPlan = true;
  
}

}
