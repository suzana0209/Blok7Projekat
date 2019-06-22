import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimetableModel2, TimetableModel3 } from 'src/app/models/timetable.model';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  baseUrl = "http://localhost:52295";

  constructor(private http:Http, private httpClient:HttpClient) { }

  addTimeTable(timeTable : TimetableModel2): Observable<any>{
    return this.httpClient.post(this.baseUrl + "/api/Timetable/Add", timeTable);
  }

  deleteTimetable(id:number){
    return this.httpClient.delete(this.baseUrl + "/api/Timetable/Delete?id=" + id);
  }

  getAll(){
    return this.httpClient.get(this.baseUrl + "/api/Timetable/GetAll");
  }

    // uradjen Include
  // getLT(){
  //     return this.httpClient.get(this.baseUrl + "/api/Timetable/LineInTT");
  // }

  editTimetable(id, timetable):Observable<any>{
    return this.httpClient.put(this.baseUrl + "/api/Timetable/Edit?id=" + id, timetable);
  }




}
