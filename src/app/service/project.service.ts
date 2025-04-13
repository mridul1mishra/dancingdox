import { Injectable } from '@angular/core';
import { Project } from './project.interface.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projects: Project[] = [
  {
    id: 1,
    title: 'Angular Project',
    docCount: 4,
    docCounttotal: 7,
    comments: 10,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    visibility: 'Public',
    members: ['Alice', 'Bob']
  },
  {
    id: 2,
    title: 'React Project',
    docCount: 4,
    docCounttotal: 7,
    comments: 5,
    startDate: '2025-02-01',
    endDate: '2025-11-30',
    visibility: 'Private',
    members: ['Charlie', 'Dave']
  }
];
  // Method to get all projects
  getProjects(): Project[] {
    return this.projects;
  }

  // Method to add a new project
  addProject(newProject: Project): void {
    this.projects.push(newProject);
  }
  getLastProjectId(): number {
    if (this.projects.length > 0) {
      // Get the last project ID using the last element of the array
      return this.projects[this.projects.length - 1].id;
    }
    return 0; // or null, depending on your preference for handling empty arrays
  }
  getLastProject(): Project | null {
    if (this.projects.length === 0) return null;
    return this.projects[this.projects.length - 1];
  }
}

