import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


interface Project {
  id: number;
  title: string;
  rating: number;
  comments: number;
  startDate: string;
  endDate: string;
  visibility: 'Public' | 'Private';
  members: string[];
}

@Component({
  selector: 'app-projectcard',
  imports: [CommonModule,RouterModule],
  templateUrl: './projectcard.component.html',
  styleUrl: './projectcard.component.css'
})
export class ProjectcardComponent {
  @Input() project!: Project;
}
