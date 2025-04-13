import { Component, OnInit } from '@angular/core';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../service/project.service';
import {Project} from '../../service/project.interface.service';
import { DataService } from '../../service/data.service';

import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-document-input',
  imports: [CommonModule, FormsModule, ProjectModalComponent],
  templateUrl: './document-input.component.html',
  styleUrl: './document-input.component.css'
})
export class DocumentInputComponent implements OnInit{
  private subscription: Subscription = new Subscription();
  newProject: Project = {
    id: 3,
    title: 'Project C',
    docCount: 4,
    docCounttotal: 10,
    comments: 5,
    startDate: '2023-05-01',
    endDate: '2023-11-30',
    visibility: 'Private',
    members: ['Alice', 'Bob']
  };
  constructor(private projectService: ProjectService,private dataService: DataService, private http: HttpClient) {}
  ngOnInit(): void {
    console.log('helloworld');
    
  }
  loadCSV() {
    const url = 'http://localhost:3000/projects.csv'; // Adjust the URL as necessary

    this.http.get('http://localhost:3000/get-csv',{ responseType: 'text' }).subscribe({
      next: (csvData) => {
        console.log('Fetched CSV Data:', csvData); // Log the fetched data
      if (!csvData) {
        console.error('Received empty data from the server.');
        return;
      }
        const rows = this.parseCSV(csvData);
        const newRow = [
          this.newProject.id.toString(),
          this.newProject.title,
          this.newProject.docCount.toString(),
          this.newProject.docCounttotal.toString(),
          this.newProject.comments.toString(),
          this.newProject.startDate,
          this.newProject.endDate,
          this.newProject.visibility,
          this.newProject.members.join(';') // Join members as a string with a semicolon
        ];
        rows.push(newRow);
        const updatedCSV = this.convertToCSV(rows);
        console.log('Updated CSV:', updatedCSV);
        this.http.post('http://localhost:3000/save-csv', { csv: updatedCSV }).subscribe({
          next: (response) => {
            console.log('CSV updated and saved:', response);
          },
          error: (error) => {
            console.error('Error saving CSV:', error);
          }
        });
      },
      error: (error) => {
        // Error callback
        console.error('Error downloading the file', error);
      }
    });
    
    
  }
  parseCSV(csvData: string): string[][] {
    const rows = csvData.split('\n').map(row => row.split(','));
    return rows;
  }
  convertToCSV(rows: string[][]): string {
    if (!rows || rows.length === 0) {
      console.error('Rows are empty, cannot convert to CSV.');
      return '';
    }
    return rows.map(row => row.join(',')).join('\n');
  }
  
  
    
  
  docCount: number = 1;
  documents: any[] = [];
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
  projectCreate(){
    this.showModal = true;
    
  }
}
