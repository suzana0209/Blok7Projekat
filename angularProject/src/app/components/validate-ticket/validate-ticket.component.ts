import { Component, OnInit } from '@angular/core';
import { ValidateTicketService } from 'src/app/services/validateTicketService/validate-ticket.service';
import { VerificationService } from 'src/app/services/verificationService/verification.service';
import { PomModelForAuthorization } from 'src/app/models/pomModelForAuth.model';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { UsersService } from 'src/app/services/users/users.service';
import { error } from 'console';
import { BuyTicketService } from 'src/app/services/buyTicketService/buy-ticket.service';
import { ValidForValidateTicketModel } from 'src/app/models/modelsForValidation/validForValidateTicket.model';

@Component({
  selector: 'app-validate-ticket',
  templateUrl: './validate-ticket.component.html',
  styleUrls: ['./validate-ticket.component.css']
})
export class ValidateTicketComponent implements OnInit {

  ticketForV : any;
  ticketExists: string = "";
  ticketMessage: string = "";
  allTT: any ;

  awaitingAppUsers:any = [];
  modelHelp: PomModelForAuthorization = new PomModelForAuthorization("");
  user: any;

  //wtfList:any = []
  userBytesImages:any = [];
  imagesLoaded:boolean = false

  pomBool: boolean = false;
  nameOfCustomer: string = "";

  nameOfCustomerMessage: string = "";
  denyController: boolean = false;
  validations: ValidForValidateTicketModel = new ValidForValidateTicketModel();
  


  constructor(private ticketServ: ValidateTicketService, 
    private verifyService: VerificationService,
    private userService: UsersService, private buyTicketService: BuyTicketService) { 
      this.userService.getUserData(localStorage.getItem('name')).subscribe(data => {
        this.user = data;    
        this.pomBool = this.user.Activated;
        this.denyController = this.user.Deny;

        //this.emailOfLoggedUser = this.user.Email;
       console.log("Serrrr:", this.user);    
   
    this.ticketServ.getAllTypeOfTicket().subscribe(data => {
      this.allTT = data;
      console.log("ALLLL TTTT: ", this.allTT);
    })

    // verifyService.getAwaitingAppUsers().subscribe(data=>{
    //   this.awaitingAppUsers = data;
    //   userService.getUserImages(this.awaitingAppUsers).subscribe(imageBytes => {
    //     this.userBytesImages = imageBytes
    //     this.userBytesImages.forEach(element => {
    //       element = "data:image/png;base64," + element
    //       this.wtfList.push(element)
    //     });
    //     this.imagesLoaded = true
    //     console.log(this.userBytesImages)
    //   })
    // })
  })
  }

  ngOnInit() {
  }


  FindTicket(n:any){
 
    console.log(n);
    this.ticketServ.getTicket(n).subscribe(data => {
      if(data == null){
        alert("Ticket not exists! ");
        return;
      }
      this.ticketForV = data;
      
      if(this.ticketForV)
      {
          this.ticketExists = "";
          if(this.ticketForV.AppUserId == "" || this.ticketForV.AppUserId == undefined || this.ticketForV.AppUserId == null)
          {
            this.ValidateTicketNoUser();
          }
      }
      else{
        this.ticketExists = "Ticket doesn't exist in database!"
      }
    }

    
    );
    
  }

  ValidateTicketNoUser()
  {
    
  
    let d : Date = new Date(this.ticketForV.PurchaseTime);

    d.setHours(d.getHours() + 1);
        if(d < new Date())
        {
          this.ticketMessage = "Ticket is not valid. Time is up!"
        }else
        {
          this.ticketMessage = "Ticket is valid."
        }
    }
  

  
  ValidateTicket(n: any)
  {
    let TT : string = "";
    this.allTT.forEach(element => {
      if(this.ticketForV.TypeOfTicketId == element.Id)
      {
          TT = element.Name;  //zapamti ime karte
      }      
    });
  
    let d : Date = new Date(this.ticketForV.PurchaseDate);

    if(n == this.ticketForV.AppUserId)
    {

      if(TT == "TimeLimited")
      {
        d.setHours(d.getHours() + 1);
        if(d < new Date())
        {
          this.ticketMessage = "Ticket is not valid. Time is up!"
        }else
        {
          this.ticketMessage = "Ticket is valid."
        }
      }

      if(TT == "Daily")
      {
        if(d.getFullYear() < new Date().getFullYear())
        {
          this.ticketMessage = "Ticket is not valid. Time is up!"
        }else if(d.getFullYear() == new Date().getFullYear())
        {
          if(d.getMonth() < new Date().getMonth())
          {
            this.ticketMessage = "Ticket is not valid. Time is up!"
          }else if(d.getMonth() == new Date().getMonth())
          {
            if(d.getDate() == new Date().getDate())
            {
              this.ticketMessage = "Ticket is valid."
            }
            else{
              this.ticketMessage = "Ticket is not valid. Time is up!"
            }
          
          }
        }
      }

      if(TT == "Monthly")
      {
        if(d.getFullYear() < new Date().getFullYear())
        {
          this.ticketMessage = "Ticket is not valid. Time is up!"
        }else if(d.getFullYear() == new Date().getFullYear())
        {
          if(d.getMonth() == new Date().getMonth())
          {
            this.ticketMessage = "Ticket is valid."
          }
          else{
            this.ticketMessage = "Ticket is not valid. Time is up!"
          }
         
        }
      }

      if(TT == "Annual")
      {
        if(d.getFullYear() == new Date().getFullYear())
        {
          this.ticketMessage = "Ticket is valid."
        }
        else
        {
          this.ticketMessage = "Ticket is not valid. Time is up!"
        }
      }

    }else
    {
      this.ticketMessage = "User with email: " + n + " did not buy ticket with Id: " + this.ticketForV.Id;
    }
  }

  // AuthorizeAppUsers(id, i){
  //   this.modelHelp.Id = id;
  //   this.verifyService.authorizeAppUser(this.modelHelp).subscribe(resp => {
  //     if(resp == "Ok")  {
  //       alert("AppUser has been authorized!");
  //       this.awaitingAppUsers.splice(i,1);
  //     }
  //      else alert("Something went wrong");
  //   })
  // }

  // DenyAppUsers(id, i){
  //   this.modelHelp.Id = id;
  //   this.verifyService.denyAppUser(this.modelHelp).subscribe(resp => {
  //     if(resp == "Ok")  {
  //       alert("AppUser has been denied!");
  //       this.awaitingAppUsers.splice(i,1);
  //     }
  //      else alert("Something went wrong");
  //   })
  // }

  CheckTicket(idTicket: any){

    //let idTicke = idTicket.toString();
    
    if(idTicket == undefined){
      idTicket = "";
    }

    this.modelHelp.Id = idTicket.toString();

    if(this.validations.validate(this.modelHelp)){
      return;
    }
    this.buyTicketService.validateTicket(this.modelHelp).subscribe(data=>{
      console.log("Poruka: ", data);
      this.buyTicketService.GetNameOfCustomer(idTicket).subscribe(dd=>{
        this.nameOfCustomer = dd.toString();
        console.log("Nameeee", this.nameOfCustomer);

        //this.nameOfCustomerMessage = this.nameOfCustomer.toString() + " bought the ticket!";
        this.nameOfCustomerMessage = (this.nameOfCustomer.toString() != "Nobody") ? this.nameOfCustomer.toString() +  " bought the ticket!" : "" ;
          //((this.nameOfCustomer.toString() == "Nobody") ?  ("")   : " bought the ticket!");
      
      })
      this.ticketMessage = data.toString() + ".";
      
    })
  }

}
