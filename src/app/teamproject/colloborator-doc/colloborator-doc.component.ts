import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { colloboratorService } from '../../service/colloborator.service';
import { Colloborator } from '../../service/colloborator.interface.service';
import { NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-colloborator-doc',
  imports: [CommonModule],
  templateUrl: './colloborator-doc.component.html',
  styleUrl: './colloborator-doc.component.css'
})
export class ColloboratorDocComponent {
  projectId!: string;
  members: Colloborator[] = [];
    constructor(private collabService: colloboratorService,private route: ActivatedRoute) {}
    ngOnInit(): void {
      this.projectId = this.route.snapshot.paramMap.get('id') || ''
      this.collabService.getColloborator(this.projectId).subscribe({
        next: (data: Colloborator[]) => {
          console.log('collaborator data:', data);
          this.members = data;
        },
        error: (err) => {
          console.error('API Error:', err);
        }
    });
    }
}
