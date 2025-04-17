import { Component, OnInit } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { DataService } from '../../service/data.service';
import { Observable } from 'rxjs';
import { Project } from '../../service/project.interface.service';
import { CommonModule } from '@angular/common';
export const recentUploads = [
  { id:1, name: 'Jillur Rahman', file: 'National Identity Card24.pdf', time: '12:41 AM 12 Oct, 2025' },
  { id:1, name: 'Kalam Nil', file: 'National Identity Card24.pdf', time: '11:30 AM 12 Oct, 2025' },
  { id:1, name: 'Aklima Fahid', file: 'Abstract.pdf', time: '08:41 PM 10 Oct, 2025' },
  { id:2, name: 'Rofik Kalam', file: 'Research proposal.doc', time: '10:41 AM 11 Oct, 2025' },
  { id:2, name: 'Sujon Abid', file: 'Research proposal.doc', time: '10:41 AM 11 Oct, 2025' }
];
@Component({
  selector: 'app-dynamicprojectdetails',
  imports: [CommonModule],
  templateUrl: './dynamicprojectdetails.component.html',
  styleUrl: './dynamicprojectdetails.component.css'
})
export class DynamicprojectdetailsComponent {
constructor(private route: ActivatedRoute,private dataService: DataService) {}
project?: Project;
recentuploads: any[] = [];
recentupload = recentUploads;
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getProjectById(id);
    this.recentuploads = recentUploads.filter(item => item.id === id);
  }
  getProjectById(id: number) {
    this.dataService.getProjectById(id).subscribe(project => {
      if (project) {
        this.project = project;
        console.log('Project Loaded:', project);
      } else {
        console.warn('Project not found');
      }
    });
  }
  getDaysLeft(endDateStr: string): number {
    const endDate = new Date(endDateStr);
    const today = new Date();
    return Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  }
  
}
