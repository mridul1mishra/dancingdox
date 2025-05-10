import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
  projects: Project | undefined;
  @Input() selectedMember: any; // Use your member interface if defined
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
    if (user?.email) {
      this.authService.getUserName(user.email).subscribe(data => {
        this.collaboratorName = data.name;
        this.useremail = data.email;
      });
    }  
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMember'] && this.selectedMember) {
      this.projects = this.selectedMember; // or this.selectedMember.documents if needed
    }
  }
  
  save(): void{
    if (!this.projects) {
      console.error('Projects data is missing');
      return;  // Exit the function if `this.projects` is undefined
    }
  
    console.log('project document', this.projects.documents);  
  if (!Array.isArray(this.projects?.documents)) {
    this.projects.documents = [];// Ensure that documents is always an array
  }
    const payload = {
      role: this.projects?.Role,     // e.g. 'admin'
      host: this.useremail, // e.g. 'dropbox'
      projects: [this.projects]
    };

    this.http.post('http://157.245.87.25:3000/updateProjectDocuments', payload)
        .subscribe({
          next: () => console.log('Projects updated successfully in CSV'),
          error: (err) => console.error('Error updating CSV:', err)
        });
  }
}
