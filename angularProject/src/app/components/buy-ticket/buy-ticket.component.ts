import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { UsersService } from 'src/app/services/users/users.service';
import { BuyTicketService } from 'src/app/services/buyTicketService/buy-ticket.service';
import { PomModelForBuyTicket } from 'src/app/models/pomModelForBuyTicket.model';
import { Router } from '@angular/router';
import { PricelistService } from 'src/app/services/pricelistService/pricelist.service';
import { PomModelForAuthorization } from 'src/app/models/pomModelForAuth.model';
import { ValidForBuyTicketModel } from 'src/app/models/modelsForValidation/validForBuyTicket.model';
import { IPayPalConfig, ICreateOrderRequest  } from 'ngx-paypal';

@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.css']
})
export class BuyTicketComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;

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

  validations: ValidForBuyTicketModel = new ValidForBuyTicketModel();

  priceWDiscount: number;
  roleForPayPal: string = "";
  mailForPayPal: string = "";

  buyTicketForm1: PomModelForBuyTicket = new PomModelForBuyTicket("", "");

  buyTicketForm1ForPrice: PomModelForBuyTicket = new PomModelForBuyTicket("", "");

  doublee: string = "3.14";
  nekiTest: number = 0;
  showButtonComplete: boolean = false;

  mailPayPalUnregisterUser: string = ""

  ng: NgForm;

  constructor(private authService: AuthenticationService, private usersService: UsersService,
    private buyTicketService: BuyTicketService,
    private router: Router,
    private priceServie: PricelistService) { 

      //ovo je samo dodato zbog email -> trebalo bi da email = ""
      //this.ng.controls['Email'].reset();

      this.showButtonComplete = true;

       this.roleForPayPal =  localStorage.getItem('role');
       this.mailForPayPal = localStorage.getItem('name');

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
    //this.initConfig(); 
  }


  // onSubmit(buyTicketForm: PomModelForBuyTicket, form: NgForm){
  //   console.log("Karta: ", buyTicketForm);
    
    

    

  //   console.log("Email from Local storage: ", this.emailLoggedUser);
  //   let rola =  localStorage.getItem('role');
  //   let mail = localStorage.getItem('name');
  //   if(rola == "AppUser"){
  //     if(this.validations.validateForTypeTicket(buyTicketForm.TypeOfTicket)){
  //       return;
  //     }
  //     buyTicketForm.Email = localStorage.getItem('name')
  //     buyTicketForm.PurchaseDate = new Date();
  //     console.log("Trenutno vreme", buyTicketForm.PurchaseDate)
  //     this.buyTicketService.buyTicket(buyTicketForm).subscribe(d=>{
  //     alert("Succesfull buy ticket");
  //     window.location.reload();
  //     });     
  //   }else if(mail == null){
  //     if(localStorage.getItem('name') == null){
  //       if(this.validations.validate(buyTicketForm.Email)){
  //         return;
  //       }
  //     }
  //     if(buyTicketForm.Email.length != 0){
  //       buyTicketForm.PurchaseDate = new Date();
  //       buyTicketForm.TypeOfTicket = "TimeLimited";
  //       this.buyTicketService.buyTicketViaEmail(buyTicketForm).subscribe();
  //       alert("Succesfull buy ticket. Expect e-mail notification");
  //       //this.router.navigate(['/busLines'])
  //       window.location.reload()
  //     }else{
  //       alert("Please enter your email address");
  //     }    
  // }
    
  // }

  

  onSubmit(buyTicketForm: PomModelForBuyTicket, form: NgForm){
    //this.showButtonComplete = false;  //za dugme Complete shopping
    console.log("Karta: ", buyTicketForm);

    this.mailPayPalUnregisterUser = buyTicketForm.Email;  //potrebno za neregistrovanog korisnika pri upisu u bazu
    
    
    console.log("Email from Local storage: ", this.emailLoggedUser);
    let rola =  localStorage.getItem('role');
    let mail = localStorage.getItem('name');

    if(rola == "AppUser"){

      if(this.validations.validateForTypeTicket(buyTicketForm.TypeOfTicket)){
        return;
      }
      this.buyTicketForm1 = buyTicketForm;
      console.log("1111", this.buyTicketForm1);

      this.buyTicketForm1.Email = localStorage.getItem('name')
      this.buyTicketForm1.PurchaseDate = new Date();

      console.log("Trenutno vreme", this.buyTicketForm1.PurchaseDate)

    //   this.buyTicketService.PriceForPayPal(this.buyTicketForm1).subscribe(a=>{
        
    //   console.log("Neki test: ", a);
    //   this.nekiTest = parseInt(a.toString(), 10);

    //   this.nekiTest = this.nekiTest * 2;
    // })

     this.initConfig();

      //this.buyTicketRegisterUser();
     
     
    }else if(mail == null){
      if(localStorage.getItem('name') == null){
        if(this.validations.validate(buyTicketForm.Email)){
          return;
        }

        this.buyTicketForm1 = buyTicketForm;

        this.buyTicketForm1.PurchaseDate = new Date();
        this.buyTicketForm1.TypeOfTicket = "TimeLimited";

        this.initConfig();
        //this.buyTicketUnregisterUser();
      }     
  }
    
  }

  buyTicketUnregisterUser(){
    console.log("Formmrrrr:", this.buyTicketForm1);
    this.buyTicketForm1.Email = this.mailPayPalUnregisterUser;
    if(this.buyTicketForm1.Email.length != 0){
      // this.buyTicketForm1.PurchaseDate = new Date();
      // this.buyTicketForm1.TypeOfTicket = "TimeLimited";
      this.buyTicketService.buyTicketViaEmail(this.buyTicketForm1).subscribe();
      alert("Succesfull bought ticket. Expect e-mail notification");
      //this.router.navigate(['/busLines'])
      window.location.reload()
    }else{
      alert("Please enter your email address");
    }    
  }

  buyTicketRegisterUser(){

    // this.buyTicketForm1.Email = localStorage.getItem('name')
    // this.buyTicketForm1.PurchaseDate = new Date();
    // console.log("Trenutno vreme", this.buyTicketForm1.PurchaseDate)

    // this.buyTicketService.PriceForPayPal(this.buyTicketForm1).subscribe(a=>{
      
    //   console.log("Neki test: ", a);
    //   this.nekiTest = +a;

    //   this.nekiTest = this.nekiTest * 2;
    // })

    this.buyTicketService.buyTicket(this.buyTicketForm1).subscribe(d=>{
    alert("Succesfull buy ticket");
    //window.location.reload();
    });     
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

  private initConfig(): void {
    this.showButtonComplete = false;

    
    if(this.mailForPayPal != null){
      this.buyTicketForm1ForPrice = this.buyTicketForm1;
    }
    else {
      this.buyTicketForm1ForPrice = this.buyTicketForm1;
      this.buyTicketForm1ForPrice.Email = "";
    }

    var diffDays;
    this.buyTicketService.PriceForPayPal(this.buyTicketForm1ForPrice).subscribe(s=>{
      if(s == "null"){
        alert("There is not active pricelist!");
        //return;
        //window.location.reload();

        this.router.navigateByUrl("/buyTicket");
        this.showButtonComplete = true;
        //this.buyTicketForm.controls['Email'].reset()
        
        //this.buyTicketForm1ForPrice.Email = "";
        return;
      }
      diffDays = parseFloat(s.toString());
      
    //})

    //var diffDays =this.nekiTest;
    //var diffDays = 65;


    console.log("cijena u dinarima: ", diffDays);
    diffDays = diffDays/118;
    var str = diffDays.toFixed(2);
    console.log("cijena u evrima: ", str);

    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',

      createOrderOnClient: (data) => <ICreateOrderRequest> {
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                  currency_code: 'EUR',
                  value: str,
                  breakdown: {
                      item_total: {
                          currency_code: 'EUR',
                          value: str
                      }
                  }
              },
              items: [{
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                      currency_code: 'EUR',
                      value: str,
                  },
              }]
          }]
      },
      advanced: {
          commit: 'true'
      },
      style: {
          label: 'paypal',
          layout: 'horizontal',
          size:  'medium',
          shape: 'pill',
          color:  'gold' 

      },

      onApprove: (data, actions) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          //actions.order.get().then(details => {
            //  console.log('onApprove - you can get full order details inside onApprove: ', details);
         // });

      },
      onClientAuthorization: (data) => {
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
         // this.showSuccess = true;
         console.log("Payerrr: ", data.payer.email_address);
         if(this.mailForPayPal == null){
           this.buyTicketUnregisterUser();
         }
         else {
           if(this.roleForPayPal == "AppUser"){
             this.buyTicketRegisterUser();
           }
         }
      },
      onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
         // this.showCancel = true;

      },
      onError: err => {
        window.alert("Something went wrong!");
          console.log('OnError', err);
          //this.showError = true;
      },
      onClick: (data, actions) => {
          console.log('onClick', data, actions);
          //this.resetStatus();
      },
  };
}) //za price
}


    // this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
    //   commit: true,
    //   client: {
    //    // sandbox: PayPalKey,
    //   },
    //   button: {
    //     label: 'paypal',
    //   },
    //   onPaymentComplete: (data, actions) => {
    //     console.log('OnPaymentComplete');
    //   },
    //   onCancel: (data, actions) => {
    //     console.log('OnCancel');
    //   },
    //   onError: (err) => {
    //     console.log('OnError');
    //   },
    //   transactions: [{
    //     amount: {
    //       currency: 'USD',
    //       total: 1 // this.vehicle.pricePerHour * diffDays * 24
    //     }
    //   }]
    // });
  }



