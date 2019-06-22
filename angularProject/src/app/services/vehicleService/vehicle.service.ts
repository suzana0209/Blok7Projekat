import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  baseUrl = "http://localhost:52295"
  constructor(private http: Http, private httpClient:HttpClient) { }

  addVehicle(vehicle): Observable<any>{
    return this.httpClient.post(this.baseUrl+"/api/Vehicles/Add",vehicle);
  }

  getAllVehicles(){
    return this.httpClient.get(this.baseUrl + "/api/Vehicles/GetAll");
  }

  getLinesForVehicle(){
    return this.httpClient.get(this.baseUrl + "/api/Vehicles/GetLinesForVehicle"); 
  }

  getTimetablesForVehicle(){
    return this.httpClient.get(this.baseUrl + "/api/Vehicles/TimetablesForVehicle"); 
  }

  deleteVehicle(id){
    return this.httpClient.delete(this.baseUrl + "/api/Vehicles/Delete?id=" + id);
  }
  //

  getVehicle(id: number){
    return this.httpClient.get(this.baseUrl + "/api/Vehicles/GetVehicle?id=" + id);
  }

  editVehicle(vehicle):Observable<any>{
    return this.httpClient.post(this.baseUrl + "/api/Vehicles/Edit", vehicle);
  }

}
