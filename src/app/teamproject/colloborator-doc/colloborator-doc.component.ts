import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { colloboratorService } from '../../service/colloborator.service';
import { Collaborator, DocumentMetadata, Project } from '../../service/project.interface.service';
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
  collaboratorName: string | undefined;
  collaboratorImage: string | undefined;
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
      
    }
    getUserDocumentStats(email: string): { total: number, complete: number, pending: number, filenames: string } {
      let total = 0;
      let complete = 0;
      let pending = 0;
      const filenamesArray: string[] = [];
      if (!this.project?.docassigned) return { total, complete, pending, filenames: '' };
    
      this.project.docassigned.forEach(doc => {
        doc.assignedcollabs.forEach(collab => {
          if (collab.assignedcollabemail === email) {
            total++;
            if (collab.uploadstatus === 'complete') complete++;
            if (collab.uploadstatus === 'pending') pending++;
            if (collab.filename) {
              filenamesArray.push(collab.filename);
            }
          }
        });
      });
      const filenames = filenamesArray.join('; ');
      return { total, complete, pending, filenames };
    }
    getProjectById(id: number): void {
      this.dataService.getProjectById(id).subscribe({
        next: (data) => {
          if (data) {
            this.project = data;
            this.documents = this.project.documents;
    
            // Parse and clean Collaborator field
            const raw = Array.isArray(this.project.Collaborator)
              ? this.project.Collaborator
              : JSON.parse(this.project.Collaborator || '[]');
    
            this.collaborators = raw.map((item: any) => {
              const cleaned: any = {};
              for (const key in item) {
                const cleanedKey = key.replace(/'/g, '').trim();
                const cleanedValue = item[key].replace(/'/g, '').trim();
                cleaned[cleanedKey] = cleanedValue;
              }
              return cleaned;
            });
    
            // Parse docassigned if it's a string
            if (typeof this.project.docassigned === 'string') {
              try {
                this.project.docassigned = JSON.parse(this.project.docassigned);
              } catch (e) {
                console.error('Failed to parse docassigned:', e);
                this.project.docassigned = [];
              }
            }
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
