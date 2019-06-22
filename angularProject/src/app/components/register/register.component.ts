import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { RegistrationModel } from 'src/app/models/registration.model';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { TypesService } from 'src/app/services/types.service';
import { UsersService } from 'src/app/services/users/users.service';
import { RequestsService } from 'src/app/services/requestsService/requests.service';
import { ValidForRegistrationModel } from 'src/app/models/modelsForValidation/validForRegistration.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthenticationService]
})

export class RegisterComponent implements OnInit {

  types: any =[];
  validations: ValidForRegistrationModel = new ValidForRegistrationModel();

  selectedImage: any;
  userBytesImage: any;

  constructor(private authService: AuthenticationService, 
    private typesService: TypesService,
    private userService: UsersService,
    private notificationServ: RequestsService, 
    private router: Router) { 
    typesService.getPassangerAll().subscribe(types =>{
      this.types = types;
    });
  }

  ngOnInit() {
  }

  selected: string = '';

  showPT(event: any){
      this.selected = event.target.value;
  }

  isSelected(): boolean{
    if(this.selected == 'AppUser'){
      return true;
    }
  }

  onSubmit(registrationData: RegistrationModel, form: NgForm) {
     console.log(registrationData);

     if(this.validations.validate(registrationData)){
       //alert("Register - ERROR! ");
      console.log(registrationData);
      return;
     } 

     if(this.confirmPassword(registrationData.Password, registrationData.ConfirmPassword) === false) {
      alert("Passwords do not match!");
      return;
    }

    if (this.selectedImage == undefined){
      //alert("No image selected!");
      this.authService.register(registrationData).subscribe(d1=>{
        if(registrationData.UserType == 'AppUser'){
          this.notificationServ.sendNotification();
        }
        alert("Registration succesfull!");
        this.router.navigate(['/logIn']);
      },
      error => {
        alert("Pasword must have number and special symbol! ")
      });
     //return; 
   }
   else{
     this.userService.uploadFile(this.selectedImage).subscribe(d2=>{
       this.authService.register(registrationData).subscribe(d3=>{
         if(registrationData.UserType != 'Admin'){
           this.notificationServ.sendNotification();
         }
         alert("Rregistration successful!");
         this.router.navigate(['/logIn']);
       },
       error => {
         alert("Pasword must have number and special symbol! ")
       });
     });
   }

  }

  onFileSelected(event){
    this.selectedImage = event.target.files;
  }

  confirmPassword(password1: string, password2: string) {
    if(password1 !== password2) return false;
    else return true;
  }
}
