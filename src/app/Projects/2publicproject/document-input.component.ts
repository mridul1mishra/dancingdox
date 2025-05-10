import { Component, OnInit } from '@angular/core';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../service/project.service';
import {DocumentMetadata, Project} from '../../service/project.interface.service';
import { DataService } from '../../service/data.service';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-document-input',
  imports: [CommonModule, FormsModule, ProjectModalComponent],
  templateUrl: './document-input.component.html',
  styleUrl: './document-input.component.css'
})

export class DocumentInputComponent {  
  projects: Project[] = [];
  lastProject!: Project;
  constructor(private projectService: ProjectService,private dataService: DataService, private http: HttpClient,private router: Router,private route: ActivatedRoute) {}
  docCount: number = 1;
  documents: any[] = [];
  
  allFilenames: DocumentMetadata[] = []; 
  
  showModal = false; // Ensure this is initialized
  openModal() {
    this.showModal = true;
  }
  moveUp(index: number) {
    if (index > 0) {
      [this.documents[index], this.documents[index - 1]] = [this.documents[index - 1], this.documents[index]];
    }
  }
  moveDown(index: number) {
    if (index < this.documents.length - 1) {
      [this.documents[index], this.documents[index + 1]] = [this.documents[index + 1], this.documents[index]];
    }
  }
  closeModal() {
    this.showModal = false;
  }
  handleFileUpload(event: any, index: number) {
    const file = event.target.files[0];
    if (file) this.documents[index].uploadedFile = file;
    
  }
  getBorderColor(index: number) {
    return index % 2 === 0 ? 'blue' : 'green';
  }
  addDocuments() {
    this.documents = Array.from({ length: this.docCount }, () => ({
      name: '',
      type: '.pdf',
      maxSize: 100,
      sizeUnit: 'Mb',
      uploadedFile: null
    }));
  }
  removeFile(index: number) {
    this.documents[index].uploadedFile = null;
  }
  
    projectCreate() {
      const formData = new FormData();
      
      
   
      // 1. Prepare files and metadata for upload
      this.documents.forEach((doc, index) => {
        if (doc.uploadedFile) {
          formData.append('files', doc.uploadedFile);
          if (doc.uploadedFile && doc.uploadedFile.name) {
            const metadata2 = {
              name: doc.name,
              type: doc.type,
              maxSize: doc.maxSize,
              sizeUnit: doc.sizeUnit,
              filename: doc.uploadedFile.name
            };
            this.allFilenames.push(metadata2);
          } else {
            console.warn('uploadedFile or uploadedFile.name is missing:', doc.uploadedFile);
          }
        }
    
        const metadata = {
          name: doc.name,
          type: doc.type,
          maxSize: doc.maxSize,
          sizeUnit: doc.sizeUnit
        };
        formData.append(`docMeta[${index}]`, JSON.stringify(metadata));
       
      });
      
      // 2. Upload files to server
      this.http.post('http://localhost:3000/upload-multiple', formData).subscribe({
        next: () => {
          console.log('Files uploaded successfully');
          this.updateProjectCSV(this.allFilenames); // Continue to CSV update
          if (this.router.url.includes('createindependentproject')) {
          this.router.navigate([`project/createindependentproject/project-start/collaborator/${Number(this.route.snapshot.paramMap.get('id'))}`]);
          }
          else {
            this.router.navigate([`project/createprivateproject/project-start/assignment/${Number(this.route.snapshot.paramMap.get('id'))}`]);
          }
        },
        error: err => {
          console.error('Upload failed:', err);
          this.updateProjectCSV(this.allFilenames); // Continue to CSV update
          
        }
      });
      if (this.router.url.includes('createindependentproject')) {
        this.router.navigate([`project/createindependentproject/project-start/collaborator/${Number(this.route.snapshot.paramMap.get('id'))}`]);
        }
        else {
          this.router.navigate([`project/createprivateproject/project-start/collaborator/assignment/${Number(this.route.snapshot.paramMap.get('id'))}`]);
        }
    }
    

  private updateProjectCSV(allFilenames: DocumentMetadata[]): void {
    this.dataService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.lastProject = data[data.length - 1];
        // Update last project
        this.lastProject.docCount = this.docCount;
        this.lastProject.documents = allFilenames;
        console.log("doccount:", this.lastProject.documents )
        this.http.post('http://localhost:3000/update-projects', this.projects).subscribe({
          next: () => console.log('CSV updated successfully'),
          error: err => console.error('Error updating CSV:', err)
        });
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      }
    });
  }
}
