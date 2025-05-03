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
  
  projectId!: string;
  constructor(private documentService: DocumentService,private route: ActivatedRoute) {}
  
}
