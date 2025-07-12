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
    const formData = new FormData();
    const projectid = Number(this.route.snapshot.paramMap.get('id'));
    formData.append('projectId', projectid.toString());
    formData.append('collabCount', this.collabCount.toString());
    formData.append('Status', 'Active');
    this.dataService.uploadDocsWithMetadata(formData).subscribe({
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
