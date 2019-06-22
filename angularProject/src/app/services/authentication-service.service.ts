import { Injectable } from '@angular/core';

import { Http, Response} from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
    base_url = 'http://localhost:52295'

    constructor(private http: Http, private httpClient:HttpClient) { }

    private parseData(res: Response){
      return res.json() || [];
    }

    register(user): Observable<any> {
        console.log(user);
        
        return this.httpClient.post(this.base_url+"/api/Account/Register",user);
    }

    logIn(loginData: any){

      let headers = new HttpHeaders();
      headers = headers.append('Content-type', 'application/x-www-form-urlencoded');

      console.log(loginData.Email);
      console.log(loginData.Password);

      console.log(localStorage.role);

      if(!localStorage.jwt){
        let x = this.httpClient.post(this.base_url+'/oauth/token',`username=${loginData.Email}&password=${loginData.Password}&grant_type=password`, {"headers":headers}) as Observable<any>

        x.subscribe(
          res => {
            console.log(res.access_token);

            let jwt = res.access_token;

            let jwtData = jwt.split('.')[1]
            let decodedJwtJsonData = window.atob(jwtData)
            let decodedJwtData = JSON.parse(decodedJwtJsonData)

            let role = decodedJwtData.role

            console.log('jwtData: ' + jwtData)
            console.log('decodedJwtJsonData: ' + decodedJwtJsonData)
            console.log(decodedJwtData)
            console.log('Role ' + role)

            let logUser = decodedJwtData.unique_name;

            localStorage.setItem('jwt', jwt)
            localStorage.setItem('role', role);
            localStorage.setItem('name',logUser);

            window.location.href="/busLines";
          },
          err => {
            console.log("Error occured");
          }
        );
      }
      else{
          //alert("Invalid email or password! ");
        // console.log("Error occured - ELSE");
      }
       
    }
  }

