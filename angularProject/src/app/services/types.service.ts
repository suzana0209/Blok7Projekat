import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';

@Injectable({
    providedIn: 'root'
  })

  export class TypesService{
    constructor(private http: Http, private httpClient: HttpClient) { }

    getPassangerAll() {
        return this.httpClient.get('http://localhost:52295/api/PassangerType/GetAllPassangerTypes')
    }
    
  }
