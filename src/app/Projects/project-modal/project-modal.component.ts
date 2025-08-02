import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { Project } from '../../service/project.interface.service';

@Component({
  selector: 'app-project-modal',
  imports: [CommonModule],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css'
})
export class ProjectModalComponent {
  constructor(private router: Router,private route: ActivatedRoute, private dataService: DataService) {}
  @Input() showModal = false;
   @Input() projectId!: number; 
  @Output() close = new EventEmitter<void>();
  projectName: string | undefined;
  projectScope: string | undefined;
  collabCount: number | undefined;

  closeModal() {
    this.close.emit();
  }
  ngOnInit() {
  this.dataService.getProjectById(this.projectId).subscribe((matchingProject: Project | undefined) => {
    this.projectName = matchingProject?.ProjectName;
    this.projectScope = matchingProject?.visibility;
    this.collabCount = matchingProject?.collabcount;

  });
  
}
  projectDetail(){
    
    this.router.navigateByUrl(`projects/${this.projectId}`);
  }
}
