import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectcardComponent } from './projectcard/projectcard.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { Project } from '../../service/project.interface.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-projectlist',
  imports: [CommonModule, ProjectcardComponent, RouterModule],
  templateUrl: './projectlist.component.html',
  styleUrl: './projectlist.component.css'
})
export class ProjectlistComponent implements OnInit {
  constructor(private router: Router,private dataService: DataService) {}
  
  projects$!: Observable<Project[]>;

  ngOnInit(): void {
    // Fetching all projects from the service
    this.projects$ = this.dataService.getAllProjects();
  }
  createNewProject(){
    this.router.navigate(['project/createindependentproject']);
  }
}
