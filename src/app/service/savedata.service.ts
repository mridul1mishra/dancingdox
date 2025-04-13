import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  constructor(private http: HttpClient) {}

  saveCSV(data: string): Observable<any> {
    return this.http.post('http://localhost:3000/save-csv', { data });
  }
}
