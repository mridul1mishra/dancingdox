import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-modal',
  imports: [CommonModule],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css'
})
export class ProjectModalComponent {
  constructor(private router: Router) {}
  @Input() showModal = false;
  @Output() close = new EventEmitter<void>();
  closeModal() {
    this.close.emit();
  }
  projectDetail(){
    this.router.navigateByUrl('projects/1');
  }
}
