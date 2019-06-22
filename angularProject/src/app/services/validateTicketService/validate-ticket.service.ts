import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { EMPTY, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidateTicketService {
  baseUrl = "http://localhost:52295"

  constructor(private http: Http, private httpClient:HttpClient, private router:Router) { }

  getAllTypeOfTicket(){
    return this.httpClient.get(this.baseUrl + "/api/Tickets/GetAllTypeOfTicket");
  }

  getTicket(id) {
    return this.httpClient.get(this.baseUrl+"/api/Tickets/GetTicket?id="+id).pipe(

    
      catchError( err => {
           if (err.status == 404) {
               //this.router.navigateByUrl('/busLines');
               alert("Ticket id doesn't exists in db!")
               return EMPTY;
           } else {
               return throwError(err);
           }
      })
    );

  }
}
