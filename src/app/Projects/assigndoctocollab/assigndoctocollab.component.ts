import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Collaborator, DocumentCollab, DocumentMetadata, Project, samplefile  } from '../../service/project.interface.service';
import { DataService } from '../../service/data.service';
import { HttpClient } from '@angular/common/http';
import { PricingplanComponent } from '../../common/pricingplan/pricingplan.component';

@Component({
  selector: 'app-assigndoctocollab',
  imports: [CommonModule,ProjectModalComponent,FormsModule,PricingplanComponent],
  templateUrl: './assigndoctocollab.component.html',
  styleUrl: './assigndoctocollab.component.css'
})
export class AssigndoctocollabComponent {
  projects: Project[] = [];
  searchText: { [fieldName: string]: string } = {};
  filteredUsers: { [fieldName: string]: any[] } = {};
  normalizedDocuments: any[] = []; 
  lastProject!: Project;
  projectId!: number;
  project: Project | undefined;
  samplefile: samplefile[] | undefined;
  collab: Collaborator[] | [] = [];
  
  constructor(private route: ActivatedRoute, private dataService: DataService, private http: HttpClient){}
  showModal = false; // Ensure this is initialized
  showDialog = false;
  showContainer = true;
  showSubscribe = false;
  
  @Input() showPricing = false;
  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loaddata(this.projectId);
  }
  loaddata(id:number){
      this.dataService.getProjectById(id)
      .subscribe({
      next: (data) => {
        if(data){
          this.project = data;  // handle success
          console.log("This is project data", data);
          this.samplefile = this.project.samplefile;
          console.log('Type:', typeof this.project.samplefile);
          this.normalizedDocuments = this.getNormalizedSamplefile(this.samplefile);

          this.collab = this.getNormalizedCollaborators();
          console.log("This is a collaborator",this.collab);
          if (!this.project.docassigned) {
            this.project.docassigned = [];
          }
        }else {
        console.warn('No project found with the given ID');
        }    
  },
  error: (error) => {
    console.error('Error fetching project:', error);  // handle error
    // You can also display an error message to the user here
    }
  });

  }
  getNormalizedSamplefile(samplefile: any): any[] {
  try {
    const parsed = typeof samplefile === 'string' ? JSON.parse(samplefile) : samplefile;
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    console.error('Invalid JSON in samplefile:', samplefile);
    return [];
  }
}
getNormalizedCollaborators(): any[] {
  const collaboratorsRaw = this.project?.Collaborator;

  if (!collaboratorsRaw) {
    return [];
  }

  if (Array.isArray(collaboratorsRaw)) {
    return collaboratorsRaw;
  }

  // If it's a JSON string or object, try to parse/convert it
  if (typeof collaboratorsRaw === 'string') {
    try {
      return JSON.parse(collaboratorsRaw);
    } catch {
      console.warn('Failed to parse collaborators JSON string');
      return [];
    }
  }

  // If it's an object but not array, try to extract array from it if possible
  if (typeof collaboratorsRaw === 'object') {
    // Example: if collaboratorsRaw = { users: [...] }
    if (Array.isArray((collaboratorsRaw as any).users)) {
      return (collaboratorsRaw as any).users;
    }
  }

  return [];
}
trackByUserId(index: number, user: any) {
  return user.id || user.email || index;
}
addCollaborator(fieldName:string, user: any) {
  if (!this.project) return;

  if (!Array.isArray(this.project.docassigned)) {
    this.project.docassigned = [];
  }

  const exists = this.project?.docassigned.some(
    assign => assign.fieldName === fieldName && assign.collabemail === user.email
  );
  if (!exists) {
    this.project?.docassigned.push({
      fieldName,
      collabName: user.name,
      collabemail: user.email,
      uploadstatus: 'pending',
      filename: 'No File'
    });
  }
  this.searchText[fieldName] = '';     // ✅ set the selected name
  this.filteredUsers[fieldName] = [];                    // ✅ optionally hide dropdown
  }
  getAssignedUsers(fieldName: string): any[] {
  return (this.project?.docassigned  && Array.isArray(this.project?.docassigned) ? this.project?.docassigned : [])
    .filter(assign => assign.fieldName === fieldName)
    .map(assign =>
      this.collab.find(user => user.name === assign.collabName)
    )
    .filter(user => !!user);
}
  onSearchInput(value: string, fieldName: string): void {
  this.searchText[fieldName] = value.toLowerCase();

  
  this.filteredUsers[fieldName] = this.collab.filter(user =>
    user.name.toLowerCase().includes(value) ||
    user.email.toLowerCase().includes(value)
  );
}
  onSearch(searchValue: string, fieldname: string): void {
    const query = searchValue.trim().toLowerCase();
    
  
    let usersArray: { name: string; email: string }[] = [];
  
    if (typeof this.collab === 'string') {
      try {
        const parsed = JSON.parse(this.collab);
        if (Array.isArray(parsed)) {
          usersArray = parsed;
        } else {
          console.warn('Parsed value is not an array');
        }
      } catch (e) {
        console.error('Error parsing users JSON:', e);
      }
    } else if (Array.isArray(this.collab)) {
      usersArray = this.collab;
    }
    
  }
  

  removeCollaborator(doc: any, user: any) {
    doc.assigned = doc.assigned.filter((u: any) => u !== user);
  }

  onCancel() {
    // Handle cancel
  }

  Create() {
    this.showDialog = true;
    if(this.project)
    {
      this.dataService.updateProject(this.project).subscribe({
      next: () => console.log('CSV updated successfully'),
      error: err => console.error('Error updating CSV:', err)
       });
    }
  }
  cancel() {
    this.showDialog = false;
  }
  confirm() {
    this.showDialog = false;
    const userDataStr = localStorage.getItem('userData');
    const userData = userDataStr ? JSON.parse(userDataStr) : null;
    
    if(userData.isSubscribed === 'true')
      this.showModal = true;
    else this.showSubscribe = true;
    console.log('Project created!');    
  }
  goToPricing(){
    this.showModal = false;
    this.showContainer = false; 
    this.showSubscribe = false;
    this.showPricing = true;
  }
}
