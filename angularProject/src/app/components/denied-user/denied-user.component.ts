import { Component, OnInit } from '@angular/core';
import { VerificationService } from 'src/app/services/verificationService/verification.service';
import { UsersService } from 'src/app/services/users/users.service';
import { PomModelForAuthorization } from 'src/app/models/pomModelForAuth.model';

@Component({
  selector: 'app-denied-user',
  templateUrl: './denied-user.component.html',
  styleUrls: ['./denied-user.component.css']
})
export class DeniedUserComponent implements OnInit {

  deniedUsers: any = [];
  user: any;
  denyAdmin: boolean = false;
  modelHelp: PomModelForAuthorization = new PomModelForAuthorization("");
  

  constructor(private verifyService: VerificationService, private userService: UsersService) {
    userService.getUserData(localStorage.getItem('name')).subscribe(data=>{
      this.user = data;
      this.denyAdmin = this.user.Deny;

      verifyService.getDeniedUsers().subscribe(a=>{
        this.deniedUsers = a;
        console.log("Denied: ", this.deniedUsers);
      })
    })
    
   

   }

  ngOnInit() {
  }

  AuthorizeDeniedAdmins(id, i) {
    this.modelHelp.Id = id;
    this.verifyService.authorizeDeniedUser(this.modelHelp).subscribe(resp => {
      if(resp == "Ok")  {
        alert("Users has been authorized!");
        this.deniedUsers.splice(i,1);
      }

       else alert("Something went wrong");
    })
  }

  
  loggedAdmin(): boolean{
    if(localStorage.getItem('role') == "Admin"){
      return true;
    }
    else{
      return false;
    }
  }

}
