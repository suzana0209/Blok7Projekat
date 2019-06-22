import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { UsersService } from 'src/app/services/users/users.service';
import { BuyTicketService } from 'src/app/services/buyTicketService/buy-ticket.service';
import { PomModelForBuyTicket } from 'src/app/models/pomModelForBuyTicket.model';
import { Router } from '@angular/router';
import { PricelistService } from 'src/app/services/pricelistService/pricelist.service';
import { PomModelForAuthorization } from 'src/app/models/pomModelForAuth.model';

@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.css']
})
export class BuyTicketComponent implements OnInit {

  loggedUser: any;

  emailLoggedUser: string = ""
  price: number = 0;
  bool: boolean = false;
  denyOfLoggedUser: boolean = false;

  listOfBuyingTicket: any = []
  pomModelForPrintTicket: PomModelForAuthorization = new PomModelForAuthorization("");
  idLoggUser: string = "";

  ticketForPrintOnHtml: any = []
  tipKarte: string[] = []

  constructor(private authService: AuthenticationService, private usersService: UsersService,
    private buyTicketService: BuyTicketService,
    private router: Router,
    private priceServie: PricelistService) { 
      console.log("cc", localStorage.getItem('name'));
    if(localStorage.getItem('name') != null){
    this.usersService.getUserData(localStorage.getItem('name')).subscribe(d=>{
      this.loggedUser = d;
      this.denyOfLoggedUser = this.loggedUser.Deny;
      console.log("Deny of loggedUser: ", this.denyOfLoggedUser);
      this.emailLoggedUser = this.loggedUser.Email
      this.idLoggUser = this.loggedUser.Id;
      console.log("Ulogovani korisnik: ", this.loggedUser)

      //this.pomModelForPrintTicket.Id = this.loggedUser.Id;

      this.buyTicketService.GetTicketWithCurrentAppUser(this.idLoggUser).subscribe(d=>{
        this.listOfBuyingTicket = d;
        console.log("Buying ticket: ", this.listOfBuyingTicket);
        
        this.tipKarte.push("");
        this.tipKarte.push("TimeLimited");
        this.tipKarte.push("Daily");
        this.tipKarte.push("Monthly");
        this.tipKarte.push("Annual");
        
        this.ticketForPrint();
      
      })

      if(localStorage.getItem('role') == "AppUser"){
        if(this.loggedUser.Activated){      
          this.bool =  true;
        } 
      }
    })
  }
  }

  ngOnInit() {
  }


  onSubmit(buyTicketForm: PomModelForBuyTicket, form: NgForm){
    console.log("Karta: ", buyTicketForm);
    

    console.log("Email from Local storage: ", this.emailLoggedUser);
    let rola =  localStorage.getItem('role');
    let mail = localStorage.getItem('name');
    if(rola == "AppUser"){
      buyTicketForm.Email = localStorage.getItem('name')
      buyTicketForm.PurchaseDate = new Date();
      console.log("Trenutno vreme", buyTicketForm.PurchaseDate)
      this.buyTicketService.buyTicket(buyTicketForm).subscribe(d=>{
      alert("Succesfull buy ticket");
      window.location.reload();
      });     
    }else if(mail == null){
      if(buyTicketForm.Email.length != 0){
        buyTicketForm.PurchaseDate = new Date();
        buyTicketForm.TypeOfTicket = "TimeLimited";
        this.buyTicketService.buyTicketViaEmail(buyTicketForm).subscribe();
        alert("Succesfull buy ticket. Expect e-mail notification");
        //this.router.navigate(['/busLines'])
        window.location.reload()
      }else{
        alert("Please enter your email address");
      }    
  }
    
  }

  nonRegister(): boolean{
    if(localStorage.getItem('name') == null)
      return true;
    else {
      return false;
    }
      
  }

  nonActivated(): boolean{
    console.log("Logged user in nonActivated: ", this.loggedUser);
    // if(localStorage.getItem('role') == "AppUser"){
    //   if(this.loggedUser.Activated){      
    //     return true;
    //   }else{
    //     return false;
    //   }     
    // }

    
      return this.bool;

    
  }

  requestDeny(): boolean{
    if(localStorage.jwt){
      if(this.denyOfLoggedUser){
        return true;
      }
    }
    return false;
  }

  ticketForPrint(){
    this.listOfBuyingTicket.forEach(element => {
      let pomString = element.PurchaseDate.toString().split('T');
      element.PurchaseDate = pomString[0] + " " + pomString[1];
      element.TypeOfTicket = element.TypeOfTicket;
    });
  }
}
