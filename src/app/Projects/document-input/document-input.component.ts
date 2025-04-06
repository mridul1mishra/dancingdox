import { Component } from '@angular/core';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-document-input',
  imports: [CommonModule, FormsModule, ProjectModalComponent],
  templateUrl: './document-input.component.html',
  styleUrl: './document-input.component.css'
})
export class DocumentInputComponent {
  docCount: number = 1;
  documents: any[] = [];
  showModal = false; // Ensure this is initialized
  openModal() {
    this.showModal = true;
  }
  moveUp(index: number) {
    if (index > 0) {
      [this.documents[index], this.documents[index - 1]] = [this.documents[index - 1], this.documents[index]];
    }
  }
  moveDown(index: number) {
    if (index < this.documents.length - 1) {
      [this.documents[index], this.documents[index + 1]] = [this.documents[index + 1], this.documents[index]];
    }
  }
  closeModal() {
    this.showModal = false;
  }
  handleFileUpload(event: any, index: number) {
    const file = event.target.files[0];
    if (file) this.documents[index].uploadedFile = file;
  }
  getBorderColor(index: number) {
    return index % 2 === 0 ? 'blue' : 'green';
  }
  addDocuments() {
    this.documents = Array.from({ length: this.docCount }, () => ({
      name: '',
      type: '.pdf',
      maxSize: 100,
      sizeUnit: 'Mb',
      uploadedFile: null
    }));
  }
  removeFile(index: number) {
    this.documents[index].uploadedFile = null;
  }
}
