import { Injectable } from '@angular/core';
import { Project } from './project.interface.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projects: Project[] = [];
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
      return this.projects[this.projects.length - 1].ID;
    }
    return 0; // or null, depending on your preference for handling empty arrays
  }
  getLastProject(): Project | null {
    if (this.projects.length === 0) return null;
    return this.projects[this.projects.length - 1];
  }
  
}

