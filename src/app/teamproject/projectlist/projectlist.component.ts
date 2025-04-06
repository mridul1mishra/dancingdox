import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectcardComponent } from './projectcard/projectcard.component';
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
  selector: 'app-projectlist',
  imports: [CommonModule, ProjectcardComponent, RouterModule],
  templateUrl: './projectlist.component.html',
  styleUrl: './projectlist.component.css'
})
export class ProjectlistComponent {
  projects: Project[] = [
    {
      
      id: 1,
      title: 'A Transformer Based Approach To Detect Suicidal',
      rating: 4,
      comments: 10,
      startDate: '20 Feb 24',
      endDate: '4 Oct 24',
      visibility: 'Public',
      members: ['user1', 'user2', 'user3']
    },
    {
      id: 2,
      title: 'A Transformer Based Approach To Detect Suicidal Ideati',
      rating: 4,
      comments: 10,
      startDate: '20 Feb 24',
      endDate: '4 Oct 24',
      visibility: 'Private',
      members: ['user4', 'user5']
    },
    {
      id: 3,
      title: 'A Transformer Based Approach To Detect Suicidal Ideati',
      rating: 4,
      comments: 10,
      startDate: '20 Feb 24',
      endDate: '4 Oct 24',
      visibility: 'Private',
      members: ['user4', 'user5']
    },
    {
      id: 4,
      title: 'A Transformer Based Approach To Detect Suicidal Ideati',
      rating: 4,
      comments: 10,
      startDate: '20 Feb 24',
      endDate: '4 Oct 24',
      visibility: 'Private',
      members: ['user4', 'user5']
    }
    
  ];

  addNewProject() {
    const newProject: Project = {
      id: this.projects[this.projects.length - 1].id + 1,
      title: 'New AI Mental Health Project',
      rating: 5,
      comments: 20,
      startDate: '10 Mar 24',
      endDate: '25 Dec 24',
      visibility: 'Private',
      members: ['user4', 'user5']
    };
    this.projects = [...this.projects, newProject]; // Adds the new project at the end of the array
  }
}
