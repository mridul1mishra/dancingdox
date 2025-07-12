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
  uploadedFile: File | null = null;
  documents: DocumentMetadata[] = [];
  
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
      fieldName: '',
      type: '.pdf',
      maxSize: 100,
      sizeUnit: 'Mb',
      uploadedFile: null,
      filename: '',
      userId: '',
      filesize:'', 
      date: new Date().toISOString() 
    }));
  }
  removeFile(index: number) {
    if (this.documents[index]) {
    this.documents[index].uploadedFile = null;
    this.documents[index].filename = ''; // Optional: clear displayed filename
  }
  }
  
  projectCreate() {
    const formData = new FormData();
    this.documents.forEach((doc, index) => {
    if (doc.uploadedFile) {
      formData.append(`file${index}`, doc.uploadedFile);
    }
    });
    const metadata = this.documents.map(doc => ({
      fieldName: doc.fieldName,
      type: doc.type,
      maxSize: doc.maxSize,
      sizeUnit: doc.sizeUnit,
      filename: doc.uploadedFile ? doc.uploadedFile.name : null,
    }));
    formData.append('documents', JSON.stringify(metadata));
    const projectid = Number(this.route.snapshot.paramMap.get('id'));
    formData.append('projectId', projectid.toString());
    formData.append('docCount', this.docCount.toString());
    
      this.dataService.uploadDocsWithMetadata(formData).subscribe({
        next: () => {
          console.log('Files uploaded successfully');
          if (this.router.url.includes('createindependentproject')) {
          this.router.navigate([`project/createindependentproject/project-start/collaborator/${Number(this.route.snapshot.paramMap.get('id'))}`]);
          }
          else {
            this.router.navigate([`project/createprivateproject/project-start/assignment/${Number(this.route.snapshot.paramMap.get('id'))}`]);
          }
        },
        error: err => {
          console.error('Upload failed:', err);          
        }
      });
    }
    

  private updateProjectCSV(allFilenames: DocumentMetadata[], projectId: number): void {
    this.dataService.getProjectById(projectId).subscribe({
      next: (data) => {
        if (!data) {
        console.warn('Project not found for id:', projectId);
        return;
      }
        this.lastProject = data;
        // Update last project
        this.lastProject.docCount = this.docCount;
        this.lastProject.documents = allFilenames;
        console.log("doccount:", this.lastProject.documents )
        this.dataService.updateProject(this.lastProject).subscribe({
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
