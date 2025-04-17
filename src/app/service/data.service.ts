import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Project } from './project.interface.service';

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
      map(csv => this.parseCsvToProjects(csv))
    );
  }
  parseCsvToProjects(csv: string): Project[] {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
  
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const row: any = {};
      headers.forEach((h, i) => {
        row[h.trim()] = (values[i] || '').trim();
      });
  
      // Convert "members" from string to string[]
      if (row.members) {
        row.members = row.members.split(';').map((m: string) => m.trim());
      }
  
      // Convert number fields
      row.id = +row.id;
      row.docCount = +row.docCount;
      row.docCounttotal = +row.docCounttotal;
      row.comments = +row.comments;
  
      return row as Project;
    });
  }
  getProjectById(id: number): Observable<Project | undefined> {
    return this.getAllProjects().pipe(
      map((projects) => projects.find(p => p.id === id))
    );
  }
}
