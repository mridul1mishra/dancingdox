import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../service/data.service';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { Project } from '../../service/project.interface.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-get-project-details',
  imports: [CommonModule, ReactiveFormsModule, ProjectModalComponent],
  templateUrl: './get-project-details.component.html',
  styleUrl: './get-project-details.component.css'
})
export class GetProjectDetailsComponent {
  showModal = false; // Ensure this is initialized
  documents: any[] = [];
  lastProject!: Project;
  openModal() {
    this.showModal = true;
  }
  
  closeModal() {
    this.showModal = false;
  }
  
  projectForm: FormGroup;
  uploadedFile: File | null = null;
  constructor(private router: Router,private fb: FormBuilder, private http: HttpClient,private dataService: DataService) {
    this.projectForm = this.fb.group({
      id: [null],
      projectName: ['', Validators.required],
      projectDetails: [''],
      projectScope: ['public', Validators.required],
      collectDocs: ['yes', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      timeZone: ['GMT-9', Validators.required],
      coHostEmails: ['', [Validators.required, Validators.pattern(/^.+@.+\..+$/)]],
      reminder: ['1hour'],
      supportStaff: [''],
      terms: [false, Validators.requiredTrue]
    });
  }
  async onNavigateprojectstart(){
    const lastProjectId = await firstValueFrom(this.getLastProject());   
    const projectData = {
      // Manually setting the new id
     ...this.projectForm.value, // Spread form values
     id: lastProjectId !== null ? lastProjectId + 1 : 1,
     members: this.projectForm.value.members
   ? this.projectForm.value.members.split(',').map((member: string) => member.trim())  // Split members into an array
   : []
   };
   console.log('Project Data:', projectData);
   this.http.post('http://localhost:3000/add-project', projectData).subscribe({
     next: () => {
       console.log('Project added to CSV!');        
     },
     error: (err) => console.error('Failed to add project:', err),
   });
    this.router.navigate(['project/createindependentproject/project-start']);
  }
  getLastProject() {
    return this.dataService.getAllProjects().pipe(
      map((projects: Project[]) => {
        return projects[projects.length - 1].id; // Get the last project
      })
    );
  }
  
  onSubmit() {
    if (this.projectForm.valid) {
      console.log('Form Submitted:', this.projectForm.value);
    }
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }
  
  removeFile() {
    this.uploadedFile = null;
  }

}
function getlastproject() {
  throw new Error('Function not implemented.');
}

