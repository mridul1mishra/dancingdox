import { Component } from '@angular/core';
import { TeamprojectComponent } from '../teamproject/teamproject.component';
import { IndependentprojectComponent } from '../independentproject/independentproject.component';

@Component({
  selector: 'app-create-projects',
  imports: [TeamprojectComponent, IndependentprojectComponent],
  templateUrl: './create-projects.component.html',
  styleUrl: './create-projects.component.css'
})
export class CreateProjectsComponent {

}
