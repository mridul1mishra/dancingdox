import { Component, OnInit } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { DataService } from '../../service/data.service';
import { Observable } from 'rxjs';
import { Project, samplefile } from '../../service/project.interface.service';
import { CommonModule } from '@angular/common';
import { ColloboratorDocComponent } from "../../teamproject/colloborator-doc/colloborator-doc.component";
import { RequiredDocComponent } from "../../teamproject/required-doc/required-doc.component";
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-dynamicprojectdetails',
  imports: [CommonModule, ColloboratorDocComponent, RequiredDocComponent],
  templateUrl: './dynamicprojectdetails.component.html',
  styleUrl: './dynamicprojectdetails.component.css'
})
export class DynamicprojectdetailsComponent {
constructor(private route: ActivatedRoute, private authService: AuthService,private dataService: DataService) {}
project?: Project;
samplefile: any;

user: any;
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getProjectById(id);
    
  }
  getProjectById(id: number) {
    this.project = undefined;
    this.dataService.getProjectById(id).subscribe((matchingProject: Project | undefined) => {
      if (matchingProject) {
         this.project = matchingProject;
		 console.log('matchingproject',matchingProject);
          this.samplefilestorage(this.project);
          localStorage.setItem('project', JSON.stringify(matchingProject));
      } else {
        console.warn('No projects found with this ID');
      }
    });
  }
samplefilestorage(project: Project) {
  let samplefileArray: samplefile[] = [];

  try {
    const raw = project.samplefile as unknown as string;
    samplefileArray = parseSamplefileRaw(raw);
    
    console.log('Parsed samplefile array:', samplefileArray);
    this.samplefile = samplefileArray;
  } catch (error) {
    console.error('❌ Failed to parse samplefile:', error);
    this.samplefile = [];
  }

  if (!samplefileArray.length) {
    console.error('samplefile array is empty or invalid:', samplefileArray);
    return;
  }

  try {
    localStorage.setItem('Storedproject', JSON.stringify(samplefileArray));
    console.log('Stored samplefile array in localStorage');
  } catch (err) {
    console.error('Error storing samplefile array:', err);
  }
}


  getSupportingFilePath(): string | null {
    let supportingfiles: any;
  const raw = localStorage.getItem('project');
  if (!raw) throw new Error('No project data found'); 
  const rawProjectData = JSON.parse(raw);
  const rawsupportingfiles = JSON.parse(rawProjectData.supportingfiles); 
    // Example: access filePath of supporting file
    const supportingFilePath = rawsupportingfiles.filePath;
    console.log('Supporting file path:', supportingFilePath);
    // Return the first available file path property (adjust if you use other names)
    return supportingFilePath;
}
openSupportingFile() {
  const path = this.getSupportingFilePath();
  if (path) {
    window.open(path, '_blank');
  } else {
    alert('No supporting file found');
  }
}
  getDaysLeft(endDateStr: string): number {
    const endDate = new Date(endDateStr);
    const today = new Date();
    return Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  }
  
}
function parseSamplefileRaw(raw: any): samplefile[] {
  if (Array.isArray(raw)) {
    // Already an array, return as is
    return raw;
  }

  if (typeof raw !== 'string') {
    throw new Error('Input is not a string');
  }

  const delimiter = '}",[';
  const splitIndex = raw.indexOf(delimiter);
  if (splitIndex === -1) {
    throw new Error('Invalid format: cannot find delimiter }",[');
  }

  const part1 = raw.substring(0, splitIndex + 1);  // e.g. '{"filename":"..."}'
  const part2 = raw.substring(splitIndex + 2).replace(/^,/, '');     // e.g. '[{...}, {...}]'

  // Remove wrapping quotes and fix doubled quotes inside part1
  const cleanedPart1 = part1
    .replace(/^"+|"+$/g, '')  // remove leading/trailing quotes
    .replace(/""/g, '"');     // replace doubled quotes
console.log("cleanedPart1:", cleanedPart1);
console.log("part2:", part2);
  const obj1 = JSON.parse(cleanedPart1);
  const arr2 = JSON.parse(part2);

  return [obj1, ...arr2];
}

