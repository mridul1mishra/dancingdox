import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Project } from '../service/project.interface.service';
import { Observable, Subscription } from 'rxjs';
import { CsvService } from '../service/savedata.service';


@Component({
  selector: 'app-testcomponent',
  imports: [CommonModule],
  templateUrl: './testcomponent.component.html',
  styleUrl: './testcomponent.component.css'
})
export class TestcomponentComponent {
  private subscription: Subscription = new Subscription();
  constructor(private http: HttpClient) {}
  newProject = {
    id: 0,
    title: '',
    docCount: 0,
    docCounttotal: 0,
    comments: 0,
    startDate: '',
    endDate: '',
    visibility: 'Private',
    members: ''
  };
  addproject(): void{
    const projectData = {
      ...this.newProject,
      members: this.newProject.members.split(',').map(member => member.trim()) // Convert members into an array
    };
    this.http.post('http://localhost:3000/add-project', projectData).subscribe({
      next: () => {
        console.log('Project added to CSV!');
        
      },
      error: (err) => console.error('Failed to add project:', err)
    });
  }
  saveData(){
    this.http.get('http://localhost:3000/get-csv', { responseType: 'text' }).subscribe({
      next: (csv) => {        
        // Handle the successful response
        
        if (!csv) {
          console.error('Received empty data from the server.');
          return;
        }
        const rows = this.parseCSV(csv);
        const updatedCSV = this.convertToCSV(rows);
        this.http.post('http://localhost:3000/save-csv', { csv: updatedCSV }).subscribe({
          next: (response) => {
            console.log('CSV updated and saved:', response);
          },
          error: (error) => {
            console.error('Error saving CSV:', error);
          }
        });
      },
      error: (err) => {
        // Handle errors
        console.error('Error loading CSV:', err);
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
}
