import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project } from '../../service/project.interface.service';
import { DataService } from '../../service/data.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-collaborator',
  imports: [CommonModule, FormsModule],
  templateUrl: './collaborator.component.html',
  styleUrl: './collaborator.component.css'
})
export class CollaboratorComponent {
  projects: Project[] = [];
  lastProject!: Project;
  collabCount: number = 1;
  documents: any[] = [];
  showModal = false; // Ensure this is initialized
  showDialog = false;
  constructor(private dataService: DataService,private http: HttpClient,private router: Router,private route: ActivatedRoute) {}
  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
  addDocuments() {
    this.dataService.getAllProjects().subscribe({
      next: (data) => {
        console.log('Received Projects:', data);
        this.projects = data;  // Directly assign the received data
        this.lastProject = data[data.length - 1];  // Get the last project
        this.lastProject.collabCount = this.collabCount;
        console.log('Last Project:', this.lastProject.collabCount);
        this.http.post('http://157.245.87.25:3000/update-projects', this.projects)
        .subscribe({
          next: () => console.log('Projects updated successfully in CSV'),
          error: (err) => console.error('Error updating CSV:', err)
        });
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
    this.router.navigate(['project/createindependentproject/project-start/collaborator/assignment/' + Number(this.route.snapshot.paramMap.get('id'))]);
    
    
  }
  confirm() {
  this.showDialog = false;
  this.showModal = true;
  console.log('Project created!');
  // You can call your createProject() method here
}
cancel() {
  this.showDialog = false;
}
}
