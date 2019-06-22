import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LineService {

  baseUrl = "http://localhost:52295"
  constructor(private http: Http, private httpClient:HttpClient) { }

  addLine(line): Observable<any>{
    return this.httpClient.post(this.baseUrl+"/api/Lines/Add",line);
  }

  getAllLines(){
    return this.httpClient.get(this.baseUrl + "/api/Lines/GetAll");
  }

  deleteLine(idLine){
    return this.httpClient.delete(this.baseUrl + "/api/Lines/Delete?id=" + idLine);
  }

  // editStation(station):Observable<any>{
  //   return this.httpClient.post(this.baseUrl+ "/api/Stations/Edit", station);
  // }

  editLine(id, line):Observable<any>{
    return this.httpClient.put(this.baseUrl + "/api/Lines/EditLine?id=" + id, line);
  }

  getLine(id: number){
    return this.httpClient.get(this.baseUrl + "/api/Lines/GetLine?id=" + id);
  }

}
