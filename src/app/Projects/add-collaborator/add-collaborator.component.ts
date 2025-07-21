import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../service/data.service';
import { Collaborator, Project } from '../../service/project.interface.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-add-collaborator',
  imports: [CommonModule, FormsModule   ],
  templateUrl: './add-collaborator.component.html',
  styleUrl: './add-collaborator.component.css'
})
export class AddCollaboratorComponent {
  email: string = '';
  projects: Project[] = [];
  lastProject!: Project;
  isEmailSet: boolean = true; // Flag to track if email is set
  isSuggestionSet: boolean = false;
  allCollaborators: Collaborator[] = [
    { name: 'kalam Kormokar', email: 'kalamkormokar123@gmail.com' },
    { name: 'Kamal Rohis', email: 'kamal@gmail.com' },
    { name: 'Jillur Rahman', email: 'jillu@gmail.com' }
  ];
  
  collaborators: Collaborator[] = []; // Initially show all
  filteredCollaborators: Collaborator[] = [];
  constructor(private router: Router,private dataService: DataService, private http: HttpClient,private route: ActivatedRoute){}
  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  console.log('Extracted ID:', id);
}
  addCollaborator() {
    this.isSuggestionSet = true;
    this.isEmailSet = false; 
    const selected = this.allCollaborators.find(c => c.email === this.email);
    if (selected && !this.collaborators.some(c => c.email === selected.email)) {
    this.collaborators.push(selected);
  }
  }
  onEmailChange(value: string) {
    this.email = value;
    this.isSuggestionSet = false;
    if (value.length === 3) {
      this.onThreeCharsEntered(value);
    }
  }
  setEmail(email: string) {
    this.email = email;
    this.isSuggestionSet = true;
    
  }
  onThreeCharsEntered(value: string) {
    console.log('3 characters entered:', value);
    this.isEmailSet = true;
    this.filteredCollaborators = this.allCollaborators.filter(c =>
      c.name.toLowerCase().includes(value.toLowerCase()) ||
      c.email.toLowerCase().includes(value.toLowerCase())
    );
  
  }
  removeCollaborator(index: number) {
    this.collaborators.splice(index, 1);
  }

  onProceed() {
    
    if (this.email.trim()) {
      console.log(this.email);
      this.dataService.getProjectById(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
        next: (data) => {
          console.log("project collaborator on proceed",data);
          data.collaborator = this.collaborators;
          console.log("onproceed collaborator",data.collaborator);
          this.dataService.updateProjectCollab(data).subscribe({
            next: () => console.log('CSV updated successfully'),
            error: err => console.error('Error updating CSV:', err)
          });
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        }
        });
      console.log('collaborator added');
      this.router.navigate([`project/createprivateproject/project-start/${Number(this.route.snapshot.paramMap.get('id'))}`]);
    }
  }
  onProceedPrivate(){
    const updatedCollaborator = {
      collaborators: this.collaborators,
      projectId: Number(this.route.snapshot.paramMap.get('id'))
    };
    this.dataService.updateProjectCollab(updatedCollaborator).subscribe(() => {
        console.log('Project updated successfully');
      });
      this.router.navigate([`project/createprivateproject/project-start/${Number(this.route.snapshot.paramMap.get('id'))}`]);
    }

  onBack() {
    alert('Back clicked!');
  }
}
