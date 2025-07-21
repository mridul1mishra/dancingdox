import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DocumentCollab, Project } from './project.interface.service';
import { tap } from 'rxjs/operators'; // make sure tap is imported


interface CollabUploadResponse {
  message: string;
  filePath: string;
}
@Injectable({
  providedIn: 'root'
})
export class DataService {
  projects: Project[] = [];
  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/api';
  getAllProjects(): Observable<Project[]> {
  return this.http.get<Project[]>(`${this.apiUrl}/csv-to-json`);
}
parseCsvToProjects(csv: string): Project[] {
    const lines = csv.trim().split('\n');
    const headers = this.smartSplit(lines[0]);  
    return lines.slice(1).map(line => {
      const values = this.smartSplit(line);
      const row: any = {};
      
      headers.forEach((h, i) => {
        const key = h.trim();
        const value = (values[i] || '').trim();
  
        if (key === 'documents') {
          try {
              row[key] = value ? tryToFixMalformedDocumentJson(value) : [];
            } catch (e) {
              console.error('Error parsing documents:', value);
              row[key] = [];
            }
        } else if (key === 'members') {
          row[key] = value ? value.split(';').map(m => m.trim()) : [];
        } else if (['id', 'docCount', 'docCounttotal', 'comments'].includes(key)) {
          row[key] = value ? +value : 0;
        } else {
          row[key] = value;
        }
      });  
      return row as Project;
    });
  }


  // Smart CSV Splitter that respects quotes
private smartSplit(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && line[i + 1] === '"') {
      // Escaped quote inside a field
      current += '"';
      i++; // skip next quote
    } else if (char === '"') {
      insideQuotes = !insideQuotes; // toggle insideQuotes flag
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current); // push the last value

  return result;
}
getProjectById(id: number): Observable<Project> {
  return this.http.get<{ project: Project }>(`${this.apiUrl}/project/${id}`)
  .pipe(map(response => response.project));
} 
  updateProjectAssignedCollab(id: number, data: { docassigned: DocumentCollab[] }) {
    return this.http.patch(`${this.apiUrl}/assigned-collaborators/${id}`, data);
  }
  updateProject(project: any){
    return this.http.post(`${this.apiUrl}/update-project`, project);
  }
  updateProjectCollab(project: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/update-project-collab`, project);
  }
  updateProjectDocAssigned(project: any, projectID: string): Observable<any>{
    const payload = {
    docassigned: project,
    projectID: projectID
  };
    return this.http.post(`${this.apiUrl}/update-project-docAssigned`, payload);
  }
  addProject(projectData: Project, file: File){
    const formData = new FormData();
    formData.append('file', file); // file key for multer or your backend
    formData.append('project', JSON.stringify(projectData)); // send project as a JSON string
    return this.http.post(`${this.apiUrl}/add-project`, formData);
  }
  deleteProjects(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-project`, {id});
  }
  uploadDocsWithMetadata(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload-multiple`, formData); // Adjust URL to match your backend route
  }
  CollabDocument(formData: FormData): Observable<CollabUploadResponse> {
  return this.http.post<CollabUploadResponse>(`${this.apiUrl}/upload-supporting-file`, formData);
  }
}
function tryToFixMalformedDocumentJson(value: string): any[] {
  try {
    // Remove surrounding brackets if needed
    const raw = value.trim().replace(/^\[|\]$/g, '');

    // Extract key-value pairs using a more controlled regex
    const pairs = raw.match(/([a-zA-Z0-9_]+):"?(.*?)"?(?=[a-zA-Z0-9_]+:|$)/g);

    if (!pairs) throw new Error('Cannot extract key-value pairs');

    const obj: any = {};

    pairs.forEach(pair => {
      const [key, ...rest] = pair.split(':');
      const value = rest.join(':').replace(/^"|"$/g, ''); // strip outer quotes
      const numericValue = Number(value);
      obj[key] = isNaN(numericValue) ? value : numericValue;
    });

    return [obj]; // return as array
  } catch (err) {
    console.error('Failed to fix malformed document JSON:', value);
    return [];
  }
}
