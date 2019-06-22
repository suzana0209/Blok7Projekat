import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DayService {

  baseUrl = "http://localhost:52295";

  constructor(private http:Http, private httpClient:HttpClient) { }

  getAll(){
    return this.httpClient.get(this.baseUrl + "/api/Days/GetAll");
  }

  getIdDay(name: string): Observable<any>{
    return this.httpClient.get(this.baseUrl + "/api/Days/GetIdDay" + name);
  }


}
