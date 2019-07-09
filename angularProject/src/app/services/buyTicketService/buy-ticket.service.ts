import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PomModelForBuyTicket, PomModelForAddTicketPayPal } from 'src/app/models/pomModelForBuyTicket.model';
import { PomModelForAuthorization } from 'src/app/models/pomModelForAuth.model';

@Injectable({
  providedIn: 'root'
})
export class BuyTicketService {

  baseUrl = "http://localhost:52295"

    constructor(private http: Http, private httpClient: HttpClient) { }
    
    buyTicket(buyTicketForm: PomModelForAddTicketPayPal) {
     return this.httpClient.post(this.baseUrl + "/api/Tickets/Add", buyTicketForm);
     
    //return this.httpClient.put(this.baseUrl + "/Tickets/Add", {email, typeOfTicket})
    }

    buyTicketViaEmail(ticket): Observable<any>{

      return this.httpClient.post(this.baseUrl + "/api/Tickets/SendMail",ticket);
   }

   validateTicket(idTicket){
     return this.httpClient.post(this.baseUrl + "/api/Tickets/ValidateTicket", idTicket); //idTicket -> pomModelForAuthorization
   }

   GetTicketWithCurrentAppUser(idUser:string) {
     return this.httpClient.get(this.baseUrl + "/api/Tickets/GetTicketWithCurrentAppUser?pom="+ idUser);
   }

   GetNameOfCustomer(idTicket){
     return this.httpClient.get(this.baseUrl + "/api/Tickets/GetNameOfCustomer?idTicket=" + idTicket);
   }

   PriceForPayPal(ticket){
     return this.httpClient.post(this.baseUrl + "/api/Tickets/PriceForPayPal", ticket);
   }

}
