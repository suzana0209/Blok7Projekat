import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PricelistService {
  base_url = "http://localhost:52295"

  constructor(private http: Http, private httpClient:HttpClient) { }


  addTicketPrices(ticketprices): any{
    return this.httpClient.post(this.base_url+"/api/TicketPrices/Add",ticketprices);
  }
  getValidPrices(id){
    return this.httpClient.get(this.base_url+"/api/TicketPrices/GetValidPrices?id=" + id);
  }

  addPricelist(pricelist): any{
    return this.httpClient.post(this.base_url+"/api/Pricelist/Add",pricelist);
  }  

  getAllPricelists() {
    return this.httpClient.get(this.base_url+"/api/Pricelist/GetPricelists");
  }

  getPricelist(){
    return this.httpClient.get(this.base_url+"/api/Pricelist/GetPricelist");
  }

  getPricelistLast(){
    return this.httpClient.get(this.base_url+"/api/Pricelist/GetPricelistLast");
  }
  
  // deletePricelist(id){
  //   return this.httpClient.delete(this.base_url+"/api/Pricelist/Delete?id=" + id);
  // }

  // changePricelist(id,pricelist): Observable<any>{
  //   return this.httpClient.put(this.base_url+"/api/Pricelist/Change?id=" + id,pricelist);
  // }

  calculateTicketPrice(pomModel){
    return this.httpClient.post(this.base_url+"/api/Pricelist/Calculate",pomModel);
  }

}
