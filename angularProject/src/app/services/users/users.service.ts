import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })

export class UsersService{
    baseUrl = "http://localhost:52295"
    constructor(private http: Http, private httpClient: HttpClient) { }
    
    getUserClaims() {
         return this.httpClient.get('http://localhost:52295/api/Account/UserInfo')
    }

    getUserData(email:string) {
    return this.httpClient.get('http://localhost:52295/api/AppUser/GetUser?email='+email)
    }

    getAdressInfo(id:number){
      return this.httpClient.get('http://localhost:52295/api/AppUser/GetAddressInfo?id=' + id)
    }

    editAppUser(pomAppUser):Observable<any>{
      return this.httpClient.post(this.baseUrl + "/api/Account/Edit", pomAppUser)
    }

    editPassword(editPassword):Observable<any>{
      return this.httpClient.post(this.baseUrl + "/api/Account/ChangePassword", editPassword);
    }

    uploadFile(selectedFiles: File[]){
      const fd = new FormData();
      for (let selectedFile of selectedFiles){
        fd.append(selectedFile.name, selectedFile)
      }    
      return this.httpClient.post(this.baseUrl + "/api/Account/PostImage", fd);
    } 
    
    getUserImage(emails:any){
      return this.httpClient.post('http://localhost:52295/api/Account/GetUserImage',emails)
    }

    getUserImages(emails:any){
      return this.httpClient.post('http://localhost:52295/api/Account/GetUserImages',emails)
    }

   
}