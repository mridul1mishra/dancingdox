import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Collaborator, DocumentMetadata, Project  } from '../../service/project.interface.service';
import { DataService } from '../../service/data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-assigndoctocollab',
  imports: [CommonModule,ProjectModalComponent,FormsModule],
  templateUrl: './assigndoctocollab.component.html',
  styleUrl: './assigndoctocollab.component.css'
})
export class AssigndoctocollabComponent {
  projects: Project[] = [];
  lastProject!: Project;
  projectId!: number;
  project: Project | undefined;
  documents: DocumentMetadata[] | undefined;
  users: Collaborator[] | [] = [];
  collaborators: Collaborator[] = [];
  filteredUsers: any[] = [];
  constructor(private route: ActivatedRoute, private dataService: DataService, private http: HttpClient){}
  showModal = false; // Ensure this is initialized
  showDialog = false;
  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loaddata(this.projectId);
  }
  loaddata(id:number){
      this.dataService.getProjectByIdNew(id)
      .subscribe({
      next: (data) => {
        if(data){
          this.project = data;  // handle success
          this.documents = this.project.documents;
          
          this.users = Array.isArray(this.project.Collaborator)
                    ? this.project.Collaborator
                    : JSON.parse(this.project.Collaborator || '[]');
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
  addCollaborator(doc: any, user: any) {
    console.log('addcollaborator called');
    if (this.project?.docassigned) {
      // Find the DocumentCollab for the provided document
      let docCollab = this.project.docassigned.find(dc => dc.docname === doc);

      if (!docCollab) {
        // If no such document assignment exists, create a new one
        docCollab = {
          docname: doc,
          assignedcollabs: []
        };
        this.project.docassigned.push(docCollab);
      }
      const alreadyAssigned = docCollab.assignedcollabs.some(
        c => c.assignedcollabemail === user.email
      );
      if (!alreadyAssigned) {
        // Assign the user to the document
        docCollab.assignedcollabs.push({ assignedcollabemail: user.email, uploadstatus: 'pending', filename: "NoName" });
        console.log(`Assigned ${user.email} to ${doc}`);
      } else {
        console.log(`${user.email} is already assigned to ${doc}`);
      }

    }
  }
  getAssignedUsers(docname: string): Collaborator[] {
    
     // Check if docname is provided
  if (!docname) {
    console.warn('Invalid docname:', docname);
    return [];
  }
     // Ensure the project and assigned collaborators are present
  if (!this.project || !this.project.docassigned) {
    console.warn('Project or assigned collaborators not available');
    return [];
  }
    
  
    const docCollab = this.project.docassigned.find(dc => dc.docname === docname);
    if (!docCollab) return [];
  
    const assignedUsers = docCollab.assignedcollabs
    .map(ac => this.users.find(u => u.email === ac.assignedcollabemail))
    .filter((user): user is Collaborator => !!user);

      if (assignedUsers.length === 0) {
        console.warn('No valid users found for document:', docname);
      }
      return assignedUsers;
  }
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchValue = input.value;
    this.onSearch(searchValue);
  }
  onSearch(searchValue: string): void {
    const query = searchValue.trim().toLowerCase();
  
    let usersArray: { name: string; email: string }[] = [];
  
    if (typeof this.users === 'string') {
      try {
        const parsed = JSON.parse(this.users);
        if (Array.isArray(parsed)) {
          usersArray = parsed;
        } else {
          console.warn('Parsed value is not an array');
        }
      } catch (e) {
        console.error('Error parsing users JSON:', e);
      }
    } else if (Array.isArray(this.users)) {
      usersArray = this.users;
    }
    this.filteredUsers = usersArray.filter(user =>
      user.name.toLowerCase().includes(query)
    );
  }
  

  removeCollaborator(doc: any, user: any) {
    doc.assigned = doc.assigned.filter((u: any) => u !== user);
  }

  onCancel() {
    // Handle cancel
  }

  Create() {
    this.showDialog = true;
    this.dataService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.lastProject = data[data.length - 1];
        this.lastProject.docassigned = this.project?.docassigned!;
        this.http.post('https://www.dashdoxs.com/api/update-projects', this.projects).subscribe({
          next: () => console.log('CSV updated successfully'),
          error: err => console.error('Error updating CSV:', err)
        });
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      }
      });
    console.log('docsassigned updated');
  }
  cancel() {
    this.showDialog = false;
  }
  confirm() {
    this.showDialog = false;
    this.showModal = true;
    console.log('Project created!');
    
  }
}
