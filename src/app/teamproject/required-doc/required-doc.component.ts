import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DocumentService } from '../../service/document.service';
import { Document } from '../../service/document.interface.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentMetadata, Project, samplefile } from '../../service/project.interface.service';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-required-doc',
  imports: [CommonModule],
  templateUrl: './required-doc.component.html',
  styleUrl: './required-doc.component.css'
})
export class RequiredDocComponent {
  documents: DocumentMetadata[] = [];
  @Input() docData!: Project | undefined;
  fileNamePart: string = '';
  userID: string | null = null; 
  selectedFile: File | null = null;
  filesize: string = "";
  fileUploaded: boolean = false;
  uploadStatus: string = 'No Action';
  projectId!: string;
  private lastDocDataJson = '';
  fileStatuses: { [fieldName: string]: string } = {};
  uploadedFilenames: { [fieldName: string]: string } = {};
  constructor(private documentService: DocumentService,private route: ActivatedRoute, private dataService: DataService,private router: Router) {}
ngDoCheck(): void {
  const current = JSON.stringify(this.docData);
  if (this.lastDocDataJson !== current) {
    this.lastDocDataJson = current;
    this.normalizeDocData();
    this.computeUploadedFilenames();
    this.computeFileStatuses();
  }
}
ngOnInit() {
  this.userID = localStorage.getItem('userID');
}
normalizeDocData(): void {
  if (!this.docData) return;

  if (typeof this.docData.documents === 'string') {
    try {
      this.docData.documents = JSON.parse(this.docData.documents);
    } catch {
      this.docData.documents = [];
    }
  }

  if (typeof this.docData.samplefile === 'string') {
    try {
      this.docData.samplefile = JSON.parse(this.docData.samplefile);
    } catch {
      this.docData.samplefile = [];
    }
  }

  if (!Array.isArray(this.docData.documents)) this.docData.documents = [];
  if (!Array.isArray(this.docData.samplefile)) this.docData.samplefile = [];

  // Add display-friendly fields
  this.docData.samplefile.forEach((file: any) => {
    file.fileNamePart = file.filename || '';
    file.filesize = file.size ? (file.size / 1024).toFixed(1) + ' KB' : '—';
  });
}
viewAllDocuments(id: number | undefined) {
  this.router.navigate([`projects/${id ?? ''}/documents`]);
}


getUploadedFilename(file: samplefile | undefined): string {
  const key = file?.fieldName?.trim().toLowerCase();
  return key ? this.uploadedFilenames[key] || '' : '';
}
onFileSelected(event: Event, file: samplefile){
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
      const uploaded = input.files[0];
      const allowedExtn = file.type;
      const uploadedExt = '.' + uploaded.name.split('.').pop()?.toLowerCase();
      if (allowedExtn && uploadedExt !== allowedExtn) {
        alert('Only ' + allowedExtn + ' files are allowed.');
        return;
      }
      const sizeUnit = file.sizeUnit?.toLowerCase(); // normalize case
      let sizeLimitInBytes = 0;
      if (sizeUnit === 'mb') {
        sizeLimitInBytes = file.maxSize * 1024 * 1024;
      } else if (sizeUnit === 'kb') {
        sizeLimitInBytes = file.maxSize * 1024;
      } else {
        // fallback to KB if sizeUnit is missing or unknown
        sizeLimitInBytes = file.maxSize * 1024;
      }
      if (uploaded.size > sizeLimitInBytes) {
        alert('File exceeds 100KB size limit.');
        return;
      }
      const today = new Date().toLocaleDateString();
      const filename  = uploaded.name;
      file.status = 'pending';    
      file.uploadedFile  = uploaded;
      this.fileUploaded = true;
      file.filesize = (uploaded.size / 1024).toFixed(1) + ' KB';
      // TODO: Call actual upload logic here
      const formData = new FormData();
      formData.append('userId', this.userID || ''); // this.userID should come from localStorage
      formData.append('fieldName', file.fieldName);
      formData.append('file', uploaded);
      formData.append('filesize', file.filesize);
      formData.append('projectId', String(this.docData?.id));
      formData.append('actions', 'Uploaded');
      this.dataService.CollabDocument(formData).subscribe({
        next: (res) => {
        console.log('Upload successful:', res.message);
        file.fileNamePart = res.filePath.split('-').slice(1).join('-');
        file.status = 'uploaded';
        const uploadedDoc: DocumentMetadata = {
        userId: this.userID || '',
        fieldName: file.fieldName,
        filename: file.fileNamePart,
        actions: 'Uploaded'
        };
       if (this.docData) {
        if (!Array.isArray(this.docData.documents)) {
            this.docData.documents = [];
        }

          this.docData.documents = [...this.docData.documents, uploadedDoc];
        }

        this.computeUploadedFilenames?.();
        this.computeFileStatuses?.();
        },
        error: (err) => {
          console.error('Upload failed:', err);
        }
      });
    }
}
computeUploadedFilenames(): void {  
  this.uploadedFilenames = {};
  const docs = this.docData?.documents;
  if (!Array.isArray(docs)) return;
  docs.forEach(doc => {
    const key = doc.fieldName?.trim()?.toLowerCase();
    if (key) this.uploadedFilenames[key] = doc.filename || '';
  });
}  
get filteredSampleFiles() {
  return this.docData?.samplefile?.filter(file => file.fieldName !== 'supportingfile') || [];
}
triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
}
computeFileStatuses(): void {
  this.fileStatuses = {};
  const documents = this.docData?.documents || [];
  const files = this.docData?.samplefile || [];
  files.forEach((file: samplefile) => {
    if (!file?.fieldName) {
      this.fileStatuses['unknown'] = 'No File Provided';
      return;
    }

  const key = file.fieldName.trim().toLowerCase();
  const matchedDoc = documents.find(
    doc => doc.fieldName?.trim().toLowerCase() === key
  );

if (!matchedDoc) {
    this.fileStatuses[key] = 'Not Uploaded';
  } else if (matchedDoc.actions?.trim()) {
    this.fileStatuses[key] = matchedDoc.actions;
  } else {
    this.fileStatuses[key] = 'Uploaded';
  }
});
}

  
  getStatusFromDocuments(file: samplefile | undefined): string {
  if (!file) return 'No File Provided';
console.log("Length",this.docData?.documents);
  if (!this.docData?.documents?.length) return 'No Documents';
  const matchedDoc = this.docData.documents.find(
    doc => doc.fieldName?.trim().toLowerCase() === file.fieldName?.trim().toLowerCase()
  );

   if (matchedDoc?.actions && matchedDoc?.actions.trim() !== '') return matchedDoc.actions;

  return 'No Documents';
}


  handleViewClick(file: any, fileInput: HTMLInputElement) {
  if (this.docData?.Host === localStorage.getItem('userID')) {
    // Host: open the file
    const url = file.uploadedFilePath || file.filePath;
      if (url) {
        window.open(url, '_blank');
      } else {
        alert('No file path available.');
      }
    }  else {
      // Not host: trigger file upload input
      fileInput.click();
    }
  }
}
