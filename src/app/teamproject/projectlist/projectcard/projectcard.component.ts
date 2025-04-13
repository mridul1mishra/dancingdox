import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Project } from '../../../service/project.interface.service';




@Component({
  selector: 'app-projectcard',
  imports: [CommonModule,RouterModule],
  templateUrl: './projectcard.component.html',
  styleUrl: './projectcard.component.css'
})
export class ProjectcardComponent {
  @Input() project!: Project;
}
