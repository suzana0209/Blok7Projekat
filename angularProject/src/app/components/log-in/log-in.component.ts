import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { RegistrationModel } from 'src/app/models/registration.model';
import { NgForm } from '@angular/forms';
import { LogInValidations } from 'src/app/models/modelsForValidation/validForLogin.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
  providers: [AuthenticationService]
})
export class LogInComponent implements OnInit {

  validations: LogInValidations = new LogInValidations();

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }


  onSubmit(loginData: RegistrationModel, form:NgForm){
    console.log(loginData);

    if(this.validations.validate(loginData)) return;


    let p =  this.authService.logIn(loginData); 
    // if(p == undefined){
    //   alert("Invalid username or password! ");
    //   window.location.reload();
      
    // }  
  }

}
