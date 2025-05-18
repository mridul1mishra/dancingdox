import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Colloborator } from './colloborator.interface.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class colloboratorService {
  private apiUrl = 'http://157.245.87.25:3000/collab/csv-to-json';

  constructor(private http: HttpClient) {}

  getColloborator(projectId: string): Observable<Colloborator[]> {
    return this.http.get(this.apiUrl, {responseType: 'text'}).pipe(
      map(csv => this.csvToDocuments(csv, projectId))
    );
  }
  private csvToDocuments(csv: string, projectId: string): Colloborator[] {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim());
  
    const collaborators: Colloborator[] = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const doc: any = {};
  
      headers.forEach((header, i) => {
        if (header === 'documents') {
          try {
            // Try to parse the stringified array for 'documents' field
            // Step 1: Replace single quotes with double quotes to make the string valid JSON
            const correctedDocuments = values[i].replace(/'/g, '"');    
            doc[header] = correctedDocuments.split(';').map(doc => doc.trim());
            
          } catch (error) {
            console.error('Error parsing documents field:', error);
            doc[header] = [];
          }
        } else {
          doc[header] = values[i];
        }
      });
  
      return doc
    });
    return collaborators.filter(c => c.ProjectID === projectId);
  }
}