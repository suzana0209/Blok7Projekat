import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  baseUrl = "http://localhost:52295";

  constructor(private http:Http, private httpClient:HttpClient) { }

  addStation(station): Observable<any>{
    return this.httpClient.post(this.baseUrl + "/api/Stations/Add", station);
  }

  getAllStations(){
    return this.httpClient.get(this.baseUrl + "/api/Stations/GetAll");
  }

  editStation(station):Observable<any>{
    return this.httpClient.post(this.baseUrl+ "/api/Stations/Edit", station);
  }

  deleteStation(idStation){
    return this.httpClient.delete(this.baseUrl + "/api/Stations/Delete?id=" + idStation);
  }

  getOrderedStations(id: number){
    return this.httpClient.get(this.baseUrl + "/api/Stations/GetOrderedAll?id=" + id);
  }

  getAll(){
    return this.httpClient.get(this.baseUrl + "/api/Stations/GetOrderedAllLines");
  }

  getIdes(){
    return this.httpClient.get(this.baseUrl + "/api/Stations/GetIdes");

  }
}
