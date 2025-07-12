import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { colloboratorService } from '../../service/colloborator.service';
import { Collaborator, DocumentCollab, DocumentMetadata, Project } from '../../service/project.interface.service';
import { NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { DataService } from '../../service/data.service';
import { Observable, of } from 'rxjs';
import { TestcomponentComponent } from "../../testcomponent/testcomponent.component";

@Component({
  selector: 'app-colloborator-doc',
  imports: [CommonModule, TestcomponentComponent],
  templateUrl: './colloborator-doc.component.html',
  styleUrl: './colloborator-doc.component.css'
})
export class ColloboratorDocComponent {
  showModal = false;
  project: Project | undefined;
  documents: DocumentMetadata[] | undefined;
  collaborators: Collaborator[] = [];
  docassigned: DocumentCollab[] = [];
  collaboratorName: string | undefined;
  collaboratorImage: string | undefined;
  docTotal: string | undefined;
  projects$: Observable<Project[]> = of([]);
  selectedMember: any;
    constructor(private collabService: colloboratorService,private route: ActivatedRoute,private authService: AuthService,private dataService: DataService) {}
    ngOnInit(): void {
      
      const id = Number(this.route.snapshot.paramMap.get('id'));
      const user = this.authService.getUserDetails();
      if (user?.email) {
        this.authService.getUserName(user.email).subscribe(data => {
          this.collaboratorName = data.name;

          this.collaboratorImage = data.image;
        });
      }
      this.getProjectById(id);
      console.log("This is my ID",id);
      
    }
    getUserDocumentStats(email: string): { total: number, complete: number, pending: number, filenames: string } {
      let total = 0;
      let complete = 0;
      let pending = 0;
      total = this.project?.docCounttotal ?? 0;
      complete = this.project?.docCount ?? 0;
      const filenamesArray: string[] = [];
      if (!this.project?.docassigned) return { total, complete, pending, filenames: '' };
      console.log("Checking docs for email:", email);
      if(this.project.visibility === "private"){  
        for (const doc of this.project.docassigned) {
          if (doc.collabemail === email) {
            total++;
            if (doc.uploadstatus === 'pending') pending++;
            if (doc.uploadstatus === 'complete') complete++;
            if (doc.filename) {
              filenamesArray.push(doc.filename);
            }
          }
        }
      }
      else if(this.project.visibility === "public"){
        console.log(this.project.documents);
        const samples = this.project.documents;
        if (typeof samples === 'string') {
        try {
          const parsedSamples = JSON.parse(samples);
          this.project.documents = Array.isArray(parsedSamples) ? parsedSamples : [];
        } catch (e) {
          console.error('Failed to parse sampleFile JSON:', e);
          this.project.documents = [];
        }
        } else if (!Array.isArray(samples)) {
          this.project.documents = [];
        }
        for(const doc of this.project.documents){          
          if (doc.fieldName) {
            filenamesArray.push(doc.fieldName);
          }                   
        }
      } 
      const filenames = filenamesArray.join('; ');
      console.log("Filename:", filenames);
      return { total, complete, pending, filenames };
    }
    getProjectById(id: number): void {
      this.dataService.getProjectById(id).subscribe({
        next: (data) => {
          if (data) {
            this.project = data;
            if (typeof this.project.documents === 'string') {
            try {
              this.project.documents = JSON.parse(this.project.documents);
            } catch {
              this.project.documents = [];
            }
          }
          // Parse Collaborator if it's a string
          if (typeof this.project.Collaborator === 'string') {
            try {
              this.project.Collaborator = JSON.parse(this.project.Collaborator);
            } catch {
              console.warn('Invalid Collaborator format:', this.project.Collaborator);
              this.project.Collaborator = [];
            }
          }
          
          if (typeof this.project.docassigned === 'string') {
            const assigned = this.project.docassigned as string;
            if (assigned.trim() === '') {
              this.project.docassigned = [];
            } 
            else {
              try {
                this.project.docassigned = JSON.parse(this.project.docassigned);
              } catch {
                console.warn('Invalid Doc assigned format:', this.project.docassigned);
                this.project.docassigned = [];
              }
            }
          }
            this.documents = this.project.documents;
            this.collaborators = this.project.Collaborator;
            this.docassigned = this.project.docassigned;
            // Parse docassigned if it's a string
          } else {
            console.warn('No project found with the given ID');
          }
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        }
      });
    }
    Modalbox(member: any) 
    {
      const colors = ['blue', 'green', 'orange'];
      console.log('Opening modal for:', member); // For debugging
      const enrichedDocs = this.project?.documents.map((doc: any, index: number) => ({
        ...doc,
        color: colors[index % colors.length] as 'blue' | 'green' | 'orange',
        actions: 'Accept',
        remarks: 'Well Written document. thanks',
      }));
      console.log('Opening document for:', enrichedDocs);
    
      // Store the enhanced data in selectedMember or a new property
      this.selectedMember = {
        ...member,
        documents: enrichedDocs
      };
      this.showModal = true;
    }
    closeModal() {
      this.showModal = false;
    }
    
}
