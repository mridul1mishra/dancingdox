import { Component } from '@angular/core';
import { Project } from '../../service/project.interface.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editproject',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './editproject.component.html',
  styleUrl: './editproject.component.css'
})
export class EditprojectComponent {
projectId!: number;
project: Project | undefined;
projectForm: FormGroup;
 uploadedFile: File | null = null;
  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loaddata(this.projectId);
  }
constructor(private route: ActivatedRoute, private dataService: DataService, private http: HttpClient,private fb: FormBuilder,private router: Router){
  this.projectForm = this.fb.group({
      Name: [''],
      title: [''],
      visibility: ['public'],
      collectDocs: ['yes'],
      startDate: [''],
      endDate: [''],
      timeZone: ['GMT-9'],
      coHostEmails: [''],
      reminder: ['1hour'],
      members: [''],
      terms: [false]
    });
}
  loaddata(id: number)
  {
      this.dataService.getProjectById(id)
      .subscribe({
      next: (data) => {if(data){ this.project = data; this.populateForm(this.project);  console.log(this.project)} else {console.warn('No project found with the given ID');}},
      error: (error) => {console.error('Error fetching project:', error);  }
      });
  }
  populateForm(data: Project) {
    console.log('Data',data.Name);
  this.projectForm.patchValue({
    Name: data.Name,
    title: data.Details,
    visibility: data.visibility,
    startDate: convertToInputDate(data.startDate),
    endDate: convertToInputDate(data.endDate),
    members: data.members
  });
  }
  proceed(){
    console.log('Form values:', this.projectForm.value);
    if (this.projectForm.valid) {
      this.project = {
        ...this.project,
        ...this.projectForm.value
      };
      console.log('Updated project:', this.project);
    } else {
      console.warn('Form is invalid');
    }
  
    if(!this.project) return;
    this.dataService.updateProject(this.project).subscribe({
      next: () => {
        console.log("Project updated successfully");
        this.router.navigate(['/projectlist']);
      },
      error: (err) => {console.error('Failed to add project:', err);}
    });
  }
  cancel(){
this.router.navigate(['/projectlist']);
  }
}
function convertToInputDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // => '2025-07-14'
}