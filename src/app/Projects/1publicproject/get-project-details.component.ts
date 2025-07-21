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
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-get-project-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './get-project-details.component.html',
  styleUrl: './get-project-details.component.css'
})
export class GetProjectDetailsComponent {
  showModal = false; // Ensure this is initialized
  documents: any[] = [];
  lastProject!: Project;
  statusMessage: string = '';
  openModal() {
    this.showModal = true;
  }
  
  closeModal() {
    this.showModal = false;
  }
  
  projectForm: FormGroup;
  uploadedFile: File | null = null;
  constructor(private router: Router,private fb: FormBuilder, private http: HttpClient,private dataService: DataService,private authService: AuthService) {
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
  ngOnInit(): void {
    const url = this.router.url;
    const scope = url.includes('createprivateproject') ? 'private' : 'public';
    this.projectForm.patchValue({ projectScope: scope });
  }
  async onNavigateprojectstart() {
  console.log('onNavigateProjectStart');
  if (!this.uploadedFile) {
  console.log('Please upload a file before continuing.');
  return;
  }
  const projectData = {
    ...this.projectForm.value,
    id: Math.floor(Date.now() / 1000),
    Host: localStorage.getItem('userID'),
    status: 'Draft',
    members: this.projectForm.value.members
      ? this.projectForm.value.members.split(',').map((m: string) => m.trim())
      : [],
  };
console.log('ProjectData for payload', this.uploadedFile);
  // Step 4: Submit via existing service
  this.dataService.addProject(projectData, this.uploadedFile).subscribe({
    next: (res) => {
      console.log('Project added successfully:', res);
      this.statusMessage = 'Project created!';
      if (this.router.url.includes('createindependentproject') && this.statusMessage.includes('Project created')) {
        this.router.navigate([`project/createindependentproject/project-start/${projectData.id}`]);
      } else if (this.router.url.includes('createprivateproject') && this.statusMessage.includes('Project created')) {
        console.log('createprivateproject', projectData.id);
        this.router.navigate([`project/createprivateproject/add-collaborator/${projectData.id}`]);
      }
    },
    error: (err) => {
      console.error('Failed to add project:', err);
      this.statusMessage = 'Failed to create project. Please try again.';
    }
  });
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

