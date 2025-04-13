import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Project } from './project.interface.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor(private http: HttpClient) { }
  getCSVData(url: string): Observable<Project[]> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(csv => this.parseCSV(csv))
    );
  }
  private parseCSV(csv: string): Project[] {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
      const values = line.split(',');

      const project: Project = {
        id: +values[0],
        title: values[1],
        docCount: +values[2],
        docCounttotal: +values[3],
        comments: +values[4],
        startDate: values[5],
        endDate: values[6],
        visibility: values[7] as 'Public' | 'Private',
        members: values[8]?.split(';') || []
      };
      return project;
    });
  }
}
