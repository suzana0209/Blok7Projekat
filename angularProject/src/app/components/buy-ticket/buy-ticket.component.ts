import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication-service.service';
import { UsersService } from 'src/app/services/users/users.service';
import { BuyTicketService } from 'src/app/services/buyTicketService/buy-ticket.service';
import { PomModelForBuyTicket, PomModelForAddTicketPayPal } from 'src/app/models/pomModelForBuyTicket.model';
import { Router } from '@angular/router';
import { PricelistService } from 'src/app/services/pricelistService/pricelist.service';
import { PomModelForAuthorization } from 'src/app/models/pomModelForAuth.model';
import { ValidForBuyTicketModel } from 'src/app/models/modelsForValidation/validForBuyTicket.model';
import { IPayPalConfig, ICreateOrderRequest  } from 'ngx-paypal';
import { PayPalModel } from 'src/app/models/payPal.model';
import { PayPalModelService } from 'src/app/services/payPalService/pay-pal-model.service';


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

  mailPayPalUnregisterUser: string = "";
  payPalModel1: PayPalModel = new PayPalModel("", "", "", "", "", "", "", 0);
  dataFromPaypalService: any;
  povratnaVrijednostPayPal: number = 0;
  pomZaKupovinuKarte: PomModelForAddTicketPayPal = new PomModelForAddTicketPayPal(new PomModelForBuyTicket("",""), 0);

  constructor(private authService: AuthenticationService, private usersService: UsersService,
    private buyTicketService: BuyTicketService,
    private router: Router,
    private priceServie: PricelistService, private payPalModelService: PayPalModelService) { 
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
        
   
     this.initConfig();
     
    }else if(mail == null){
      if(localStorage.getItem('name') == null){
        if(this.validations.validate(buyTicketForm.Email)){
          return;
        }
        this.buyTicketForm1 = buyTicketForm;
        this.buyTicketForm1.PurchaseDate = new Date();
        this.buyTicketForm1.TypeOfTicket = "TimeLimited";

        this.initConfig();
        
      }     
  }
    
  }

  buyTicketUnregisterUser(){
    console.log("Formmrrrr:", this.buyTicketForm1);
    this.buyTicketForm1.Email = this.mailPayPalUnregisterUser;
    if(this.buyTicketForm1.Email.length != 0){
      
      this.pomZaKupovinuKarte.pomModelForBuyTicket = this.buyTicketForm1;
      this.pomZaKupovinuKarte.PayPalModelId = this.povratnaVrijednostPayPal;

      this.buyTicketService.buyTicketViaEmail(this.pomZaKupovinuKarte).subscribe(); //buyTicketForm1
      alert("Succesfull bought ticket. Expect e-mail notification");
      
      window.location.reload()
    }else{
      alert("Please enter your email address");
    }    
  }
  buyTicketRegisterUser(){
    
    this.pomZaKupovinuKarte.pomModelForBuyTicket = this.buyTicketForm1;
    this.pomZaKupovinuKarte.PayPalModelId = this.povratnaVrijednostPayPal;

    this.buyTicketService.buyTicket(this.pomZaKupovinuKarte).subscribe(d=>{
      alert("Succesfull buy ticket");
      window.location.reload();
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
    //console.log("Logged user in nonActivated: ", this.loggedUser);
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
        this.showButtonComplete = true;
        window.location.reload();
      }
      else{
        diffDays = parseFloat(s.toString());
      }
      
    
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
         this.dataFromPaypalService = data;
         //console.log("Payerrr: ", data.payer.email_address);
         //console.log("Data from patpal", this.dataFromPaypalService);

         this.payPalModel1.PayerEmail = this.dataFromPaypalService.payer.email_address;
         this.payPalModel1.PayerName = this.dataFromPaypalService.payer.name.given_name;
         this.payPalModel1.PayerSurname = this.dataFromPaypalService.payer.name.surname;
         this.payPalModel1.Status = this.dataFromPaypalService.status;
         this.payPalModel1.CreateTime = this.dataFromPaypalService.create_time;
         this.payPalModel1.PayementId = this.dataFromPaypalService.id;
         this.payPalModel1.Value = this.dataFromPaypalService.purchase_units[0].amount.value;
         this.payPalModel1.CurrencyCode = this.dataFromPaypalService.purchase_units[0].amount.currency_code;

         console.log("PayPal model1: ", this.payPalModel1);

         this.payPalModelService.postPayPalModel(this.payPalModel1).subscribe(ddd=>{
          this.povratnaVrijednostPayPal = ddd;
          //console.log("Povratna  vrijednost: ", ddd);

          if(ddd != 0){
            if(this.mailForPayPal == null){
              this.buyTicketUnregisterUser();
            }
            else {
              if(this.roleForPayPal == "AppUser"){
                this.buyTicketRegisterUser();
              }
            }
          }
         })
         console.log("Ret paypal: ", this.povratnaVrijednostPayPal);

         
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
      },
  };
}) 
}
    
}