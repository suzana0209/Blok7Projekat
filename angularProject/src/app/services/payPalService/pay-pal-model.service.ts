import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { PayPalModel } from 'src/app/models/payPal.model';

@Injectable({
  providedIn: 'root'
})
export class PayPalModelService {

  base_url = "http://localhost:52295";


  constructor(private http: Http, private httpClient:HttpClient) { }

  postPayPalModel(payPalModel1: PayPalModel): any{
    return this.httpClient.post(this.base_url + "/api/PayPalModels/Add", payPalModel1);
  }
}
