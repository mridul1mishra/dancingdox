import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Project } from './project.interface.service';
import { tap } from 'rxjs/operators'; // make sure tap is imported

@Injectable({
  providedIn: 'root'
})
export class DataService {
  projects: Project[] = [];
  constructor(private http: HttpClient) { }
  getAllProjects(): Observable<Project[]> {
    return this.http.get('http://localhost:3000/csv-to-json', {
      responseType: 'text' as const
    }).pipe(
      map(csv => this.parseCsvToProjects(csv)),  // Parse CSV to Project array
    );
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
            row[key] = value ? JSON.parse(value) : [];
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
  getProjectById(id: number): Observable<Project[] | undefined> {
    return this.getAllProjects().pipe(
      map((projects) => {
        const foundProject = projects.filter(p => p.id === id);
        return foundProject;
    }));
  }
}
