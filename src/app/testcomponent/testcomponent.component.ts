import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { DataService } from '../service/data.service';
import { ActivatedRoute } from '@angular/router';
import { DocumentMetadata, Project, ProjectWithDocuments } from '../service/project.interface.service';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-testcomponent',
  imports: [CommonModule,FormsModule ],
  templateUrl: './testcomponent.component.html',
  styleUrl: './testcomponent.component.css'
})
export class TestcomponentComponent {
  actions = ['Accept', 'Reject', 'In Review'];
  
  collaboratorName: string | undefined;
  projects: Project[] | undefined;
  @Input() showModal = false;
  @Output() close = new EventEmitter<void>();
useremail: string | undefined;
metadocument: DocumentMetadata[] | undefined;
  constructor(private authService: AuthService,private dataService: DataService,private route: ActivatedRoute,private http: HttpClient) {}
  closeModal() {
    this.close.emit();
  }
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const user = this.authService.getUserDetails();
    console.log('user details',user);
    if (user?.email) {
      this.authService.getUserName(user.email).subscribe(data => {
        this.collaboratorName = data.name;
        this.useremail = data.email;
      });
    }
    this.getProjectById(id);   
  }
  getProjectById(id: number): void {
        this.dataService.getProjectById(id).subscribe((projects: Project[] | undefined) => {
          if (projects && projects.length > 0) {
            const currentUsername = this.authService.getUserDetails()?.email;
            const matchingProject = projects.find(project =>
              project.Host.trim().toLowerCase() === currentUsername?.trim().toLowerCase()
            );
            if (matchingProject) {
              const colors = ['blue', 'green', 'orange'];   
              // Optional: assign to component variable if needed
              this.metadocument = matchingProject.documents.map((doc, index) => ({
                ...doc,
                color: colors[index % colors.length] as 'blue' | 'green' | 'orange',
                actions: 'Accept',
                remarks: 'Well Written document. thanks'
              }));              
            } else {
              console.warn('No project matched current user.');
            }
            
            this.projects = projects;
          } else {
            console.warn('No projects found with this ID');
          }
        });
      }
  
  save(): void{
    const matchingproject = this.projects?.find( p => p.Role.toLowerCase() === 'collaborator' && p.Host === this.useremail)
    
    if (matchingproject) {
      matchingproject.documents = this.metadocument ??[];
    }
    const payload = {
      role: 'Collaborator',     // e.g. 'admin'
      host: this.useremail, // e.g. 'dropbox'
      projects: this.projects
    };
console.log(this.projects);
    this.http.post('http://localhost:3000/updateProjectDocuments', payload)
        .subscribe({
          next: () => console.log('Projects updated successfully in CSV'),
          error: (err) => console.error('Error updating CSV:', err)
        });
  }
}
