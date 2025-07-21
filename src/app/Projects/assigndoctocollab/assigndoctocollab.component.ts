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
          const samplefile = this.project.samplefile
          if (Array.isArray(samplefile)) {
            this.normalizedDocuments = this.project.samplefile;
          } else {
            this.normalizedDocuments = JSON.parse(samplefile);
          }
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
  if (typeof samplefile !== 'string') return [];

  try {
    // Check if it's in the broken format: stringified object + array
    const splitIndex = samplefile.indexOf('}",[');
    if (splitIndex !== -1) {
      const part1 = samplefile.slice(0, splitIndex + 1);
      const part2 = samplefile.slice(splitIndex + 2);

      const fixedPart1 = part1.replace(/""/g, '"').replace(/\\"/g, '"');
      const cleanedPart1 = fixedPart1.startsWith('"') && fixedPart1.endsWith('"')
        ? fixedPart1.slice(1, -1)
        : fixedPart1;

      const obj1 = JSON.parse(cleanedPart1);
      const obj2 = JSON.parse(part2);
      console.log(obj1, obj2);
      return [obj1, ...obj2]; // Combine both into an array
    }

    // Otherwise, try to parse normally
    const parsed = JSON.parse(samplefile);
    return Array.isArray(parsed) ? parsed : [parsed];

  } catch (err) {
    console.error('Invalid JSON in samplefile:', samplefile);
    return [];
  }
}
getNormalizedCollaborators(): any[] {
  const collaboratorsRaw = this.project?.collaborator;

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
    
  }
  cancel() {
    this.showDialog = false;
  }
  confirm() {
    this.showDialog = false;
    const userDataStr = localStorage.getItem('userData');
    const userData = userDataStr ? JSON.parse(userDataStr) : null;
    console.log('showModal',this.showModal);
    if(this.project)
    {
      this.dataService.updateProjectDocAssigned(this.project.docassigned, this.projectId.toString()).subscribe({
      next: () => console.log('CSV updated successfully'),
      error: err => console.error('Error updating CSV:', err)
       });
    }
    if(userData.isSubscribed === 'true'){
      this.showModal = true;
    this.showContainer=false;
}
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
function parseSamplefileRaw(raw: any): samplefile[] {
  if (Array.isArray(raw)) {
    // Already an array, return as is
    return raw;
  }

  if (typeof raw !== 'string') {
    throw new Error('Input is not a string');
  }

  const delimiter = '}",[';
  const splitIndex = raw.indexOf(delimiter);
  if (splitIndex === -1) {
    throw new Error('Invalid format: cannot find delimiter }",[');
  }

  const part1 = raw.substring(0, splitIndex + 1);  // e.g. '{"filename":"..."}'
  const part2 = raw.substring(splitIndex + 2).replace(/^,/, '');     // e.g. '[{...}, {...}]'

  // Remove wrapping quotes and fix doubled quotes inside part1
  const cleanedPart1 = part1
    .replace(/^"+|"+$/g, '')  // remove leading/trailing quotes
    .replace(/""/g, '"');     // replace doubled quotes
console.log("cleanedPart1:", cleanedPart1);
console.log("part2:", part2);
  const obj1 = JSON.parse(cleanedPart1);
  const arr2 = JSON.parse(part2);

  return [obj1, ...arr2];
}