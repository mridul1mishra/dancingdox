import { Component,  OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { inject } from '@angular/core';



export const projects = [{
  id: 1,
  title: 'A Transformer Based Approach To Detect Suicidal Ideation',
  status: 'Active',
  scope: 'Public',
  participants: 17,
  host: 'The Interdisciplinary Research Consortium',
  createdOn: '20 Feb 2024',
  dueDate: '04 Oct 2024',
  projectId: '355202323',
  description: `The Interdisciplinary Research and Innovation Consortium (IRIC) is a collaborative academic team 
    dedicated to exploring new frontiers of knowledge through in-depth research, data-driven insights, 
    and interdisciplinary collaboration.`
},
{
  id: 2,
  title: 'A Transformer Based Approach To Detect Suicidal Ideation',
  status: 'Active',
  scope: 'Public',
  participants: 15,
  host: 'The Interdisciplinary Research Consortium',
  createdOn: '20 Feb 2024',
  dueDate: '04 Oct 2024',
  projectId: '355202323',
  description: `The Interdisciplinary Research and Innovation Consortium (IRIC) is a collaborative academic team 
    dedicated to exploring new frontiers of knowledge through in-depth research, data-driven insights, 
    and interdisciplinary collaboration.`
}

];
export const recentUploads = [
  { id:1, name: 'Jillur Rahman', file: 'National Identity Card24.pdf', time: '12:41 AM 12 Oct, 2025' },
  { id:1, name: 'Kalam Nil', file: 'National Identity Card24.pdf', time: '11:30 AM 12 Oct, 2025' },
  { id:1, name: 'Aklima Fahid', file: 'Abstract.pdf', time: '08:41 PM 10 Oct, 2025' },
  { id:2, name: 'Rofik Kalam', file: 'Research proposal.doc', time: '10:41 AM 11 Oct, 2025' },
  { id:2, name: 'Sujon Abid', file: 'Research proposal.doc', time: '10:41 AM 11 Oct, 2025' }
];
export const requiredDocuments = [
  { id: 1, name: 'National Identity card', format: ['.JPG', '.DOC', '.PDF'], size: '300 Kb', uploadDate: '12 Oct, 2025', status: 'Accepted' },
  { id: 1, name: 'Research Proposal', format: ['.JPG', '.DOC', '.PDF'], size: '300 Kb', uploadDate: '12 Oct, 2025', status: 'Rejected' },
  { id: 1,name: 'Methodology Names', format: ['.JPG', '.DOC', '.PDF'], size: '300 Kb', uploadDate: '12 Oct, 2025', status: 'Pending' },
  { id: 2,name: 'Abstract of the paper', format: ['.JPG', '.DOC', '.PDF'], size: '300 Kb', uploadDate: '12 Oct, 2025', status: 'Not Uploaded' }
];
export const comments = [
  {
    name: 'Hendric Suneo',
    avatar: 'assets/avatar1.jpg',
    date: '21 Oct, 2024 12:56',
    content: `Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
    sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`
  },
  {
    name: 'Kesha Jean',
    avatar: 'assets/avatar2.jpg',
    date: '21 Oct, 2024 12:56',
    content: `Adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.`
  }
];

@Component({
  selector: 'app-projectdetails',
  imports: [CommonModule, FormsModule],
  
  templateUrl: './projectdetails.component.html',
  styleUrl: './projectdetails.component.css'
})
export class ProjectdetailsComponent {
  project: any;
  recentuploads: any[] = [];
  requiredDocument: any[] = [];
  private route = inject(ActivatedRoute);
  
  recentupload = recentUploads;
  projects = projects;
  requiredDocuments = requiredDocuments;
  comments = comments;


  constructor() {
    
  }
  ngOnInit() {
    // Get the 'id' from the route parameters
    this.route.paramMap.subscribe(params => {
      const id = +this.route.snapshot.paramMap.get('id')!;  // Convert the 'id' to a number
      this.project = this.getProjectById(id);
      this.recentuploads = recentUploads.filter(item => item.id === id);
      this.requiredDocument = requiredDocuments.filter(item => item.id === id);
    });
  }
  getProjectById(id: number) {
    return this.projects.find(project => project.id === id);
  }
  
  
  
}


