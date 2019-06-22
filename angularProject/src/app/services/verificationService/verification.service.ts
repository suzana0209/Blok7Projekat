import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  baseUrl = "http://localhost:52295"
  

  constructor(private http: Http, private httpClient: HttpClient) { }
  getAwaitingAdmins(): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/api/Account/GetAwaitingAdmins");
  }

   authorizeAdmin(adminId): Observable<any> {
    return this.httpClient.post(this.baseUrl + "/api/Account/AuthorizeAdmin", adminId);
  }

   getAwaitingControllers(): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/api/Account/GetAwaitingAControllers");
  }

   authorizeController(controllerId): Observable<any> {
  //  let data = `${controllerId}`;
    let headers = new HttpHeaders();
    headers = headers.append( "Content-type","application/json");
    return this.httpClient.post(this.baseUrl + "/api/Account/AuthorizeController", controllerId);
  }

  getAwaitingAppUsers(): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/api/Account/GetAwaitingAppUsers");
  }

  authorizeAppUser(appUserId): Observable<any> {
      let headers = new HttpHeaders();
      headers = headers.append( "Content-type","application/json");
      return this.httpClient.post(this.baseUrl + "/api/Account/AuthorizeAppUser", appUserId);
    }

    denyAppUser(appUserId): Observable<any> {
      let headers = new HttpHeaders();
      headers = headers.append( "Content-type","application/json");
      return this.httpClient.post(this.baseUrl + "/api/Account/DenyAppUser", appUserId);
    }
  



  
}
