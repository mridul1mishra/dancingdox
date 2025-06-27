import { HttpClient } from "@angular/common/http";
import { CardData } from "./project.interface.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root' // this works globally, unless you're using standalone-only setup
})
export class PaymentService {
  private apiUrl = 'https://www.dashdoxs.com/api';

  constructor(private http: HttpClient) {}

  storeCard(cardData: CardData, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/store-card`, cardData,{headers: {'x-user-email': email }
  });
  }
}