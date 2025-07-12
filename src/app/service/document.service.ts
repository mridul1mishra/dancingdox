import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Document } from './document.interface.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:3000docs/csv-to-json';

  constructor(private http: HttpClient) {}

  getDocuments(projectId: string): Observable<Document[]> {
    return this.http.get(this.apiUrl, {responseType: 'text'}).pipe(
      map(csv => this.csvToDocuments(csv, projectId))
    );
  }
  private csvToDocuments(csv: string, projectID: string): Document[] {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim());

    const document: Document[] = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const doc: any = {};
      headers.forEach((header, i) => {
        doc[header] = values[i];
      });
      return doc
    });
    return document.filter(d => d.projectID === projectID)
  }
}