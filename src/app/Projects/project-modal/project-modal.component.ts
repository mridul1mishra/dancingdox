import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-modal',
  imports: [CommonModule],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css'
})
export class ProjectModalComponent {
  constructor(private router: Router,private route: ActivatedRoute) {}
  @Input() showModal = false;
   @Input() projectId!: number; 
  @Output() close = new EventEmitter<void>();
  closeModal() {
    this.close.emit();
  }
  ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  console.log('Project ID:', id);
}
  projectDetail(){
    
    this.router.navigateByUrl(`projects/${this.projectId}`);
  }
}
