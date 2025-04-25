import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DocumentService } from '../../service/document.service';
import { Document } from '../../service/document.interface.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-required-doc',
  imports: [CommonModule],
  templateUrl: './required-doc.component.html',
  styleUrl: './required-doc.component.css'
})
export class RequiredDocComponent {
  documents: Document[] = [];
  projectId!: string;
  constructor(private documentService: DocumentService,private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || ''
    this.documentService.getDocuments(this.projectId).subscribe({
      next: (data: Document[]) => {
        console.log('Fetched data:', data);
        this.documents = data;
      },
      error: (err) => {
        console.error('API Error:', err);
      }
  });
  }
}
