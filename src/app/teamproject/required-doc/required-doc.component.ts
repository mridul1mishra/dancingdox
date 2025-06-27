import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DocumentService } from '../../service/document.service';
import { Document } from '../../service/document.interface.service';
import { ActivatedRoute } from '@angular/router';
import { DocumentMetadata, Project } from '../../service/project.interface.service';


@Component({
  selector: 'app-required-doc',
  imports: [CommonModule],
  templateUrl: './required-doc.component.html',
  styleUrl: './required-doc.component.css'
})
export class RequiredDocComponent {
  documents: DocumentMetadata[] = [];
  @Input() docData!: Project | undefined; 
  selectedFile: File | null = null;
  filesize: string = "";
  fileUploaded: boolean = false;
  uploadStatus: string = 'No Action';
  projectId!: string;
  constructor(private documentService: DocumentService,private route: ActivatedRoute) {}
  onFileSelected(event: Event, index: number){
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed.');
        return;
      }
      if (file.size > 100 * 1024) {
        alert('File exceeds 100KB size limit.');
        return;
      }
    const today = new Date().toLocaleDateString();
    const doc = this.docData?.documents[index];
    if (doc) {
      doc.date = today;
     doc.filename = file.name;
     doc.actions = "pending"
    }
      this.selectedFile = file;
      this.fileUploaded = true;
      this.filesize = (file.size / 1024).toFixed(1) + ' KB';
      // TODO: Call actual upload logic here
    }
  }
  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }
}
