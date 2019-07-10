import { Component, OnInit } from '@angular/core';
import { TicketPricesPomModel } from 'src/app/models/ticketPrice.model';
import { PricelistService } from 'src/app/services/pricelistService/pricelist.service';
import { PriceListModel } from 'src/app/models/priceList.model';
import { NgForm } from '@angular/forms';
import { PomModelForPriceList } from 'src/app/models/pomModelForPriceList.model';
import { ValidForPriceListModel, ValidForPriceModel, ValidForDateTimeInPriceList } from 'src/app/models/modelsForValidation/validForPriceList.model';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit {

  priceList: any;
  ticketPricesPom: TicketPricesPomModel = new TicketPricesPomModel(0,0,0,0,0,new PriceListModel(new Date(),new Date(),0, []));
  datumVazenjaBool: boolean = false;
  validPrices: TicketPricesPomModel = new TicketPricesPomModel(0,0,0,0,0,null);
  //validPrices: TicketPricesPomModel
  validPricesForShow: TicketPricesPomModel;

  selectedTicket: string = "";
  selectedPassanger: string = "";
  showLabel: boolean = false;

  pomModelForPriceList: PomModelForPriceList = new PomModelForPriceList(0, "", "");

  retPrice: any;
  validations: ValidForPriceListModel = new ValidForPriceListModel();
  showPriceInInput:boolean = false;
  validationsForPrice: ValidForPriceModel = new ValidForPriceModel();
  validationsForDate: ValidForDateTimeInPriceList = new ValidForDateTimeInPriceList();
  datePickerId: any;

  priceListModelForCheckDatum: PriceListModel = new PriceListModel(new Date(),new Date(),0, []);
  userPom: any;
  boolBezvezeZaPoruku: boolean = false;
  boolBezvezeZaPorukuDenied: boolean = false;

  typePassanger: string = "";
  messageNoExistPricelist: string = "";
  prviAddPL: boolean = true;

  constructor( private pricelistServ: PricelistService, private userService: UsersService) { 
    this.prviAddPL = true;
    this.userService.getUserData(localStorage.getItem('name')).subscribe(a=>{
      console.log("Userrr: ", a);
      if(a != null && a != undefined){
        
        this.userPom = a;
        this.boolBezvezeZaPoruku = this.userPom.Activated;
        this.boolBezvezeZaPorukuDenied = this.userPom.Deny;
      }
      
    })
    this.datePickerId = new Date().toISOString().split('T')[0];
    this.showPriceInInput = false;
    this.pricelistServ.getPricelist().subscribe(data => {  
      if(data == null){
        //alert("There is not currently active price list!");
        this.messageNoExistPricelist = "There is not valid price list!";
        return;
      }    
      this.priceList = data; 
      console.log("Price list from db: ", this.priceList);
      
      console.log("Data list from db: ",data);

       this.validPrices = new TicketPricesPomModel(0,0,0,0,0,new PriceListModel(new Date(),new Date(),0, []));
       this.validPricesForShow = new TicketPricesPomModel(0,0,0,0,0,new PriceListModel(new Date(),new Date(),0, []));
       this.priceList.ListOfTicketPrices.forEach(element => {

        if(element.TypeOfTicketId == 2)
        {
          this.validPrices.Daily = element.Price;
          this.validPricesForShow.Daily = element.Price;
        }
        if(element.TypeOfTicketId == 1)
        {
          this.validPrices.TimeLimited = element.Price;
          this.validPricesForShow.TimeLimited = element.Price;
        }
        if(element.TypeOfTicketId == 3)
        {
          this.validPrices.Monthly = element.Price;
          this.validPricesForShow.Monthly = element.Price;
        }
        if(element.TypeOfTicketId == 4)
        {
          this.validPrices.Annual = element.Price;
          this.validPricesForShow.Annual = element.Price;
        }        
      });
     });
     
  }

  ngOnInit() {
  }

  onSubmit(pm: PriceListModel, form: NgForm){
    
    console.log("PM: ", pm);
    if(this.validationsForDate.validate(pm)){
      return;
    }
    

    this.pricelistServ.CheckDateTime(pm).subscribe(a=>{
      if(a == "No"){
        alert("Date is invalid!");
        //window.location.reload();
        return;
      }
      else if(a == "less"){
        alert("<To time> date can't be less than <From time> date!");
        return;
      }
      else if(a == "Yes"){
        this.ticketPricesPom.PriceList = pm;
    this.pricelistServ.addPricelist(this.ticketPricesPom).subscribe( x =>{
      if(x){
        alert("Price list succesfull added!");
        window.location.reload();
        //form.reset();
      }
      else{
        alert("Erorr!");
        //window.location.reload();
      }
      //console.log(x);
    })

      }
    })

    //let priceL : any;
    //let bol : boolean = false;
    // this.ticketPricesPom.PriceList = pm;
    // this.pricelistServ.addPricelist(this.ticketPricesPom).subscribe( x =>{
    //   if(x){
    //     alert("Price list succesfull added!");
    //   }
    //   else{
    //     alert("Erorr!");
    //   }
    //   //console.log(x);
    // })



    // bol = this.pricelistServ.addPricelist(pm).subscribe()
    //     if(bol){
    //      priceL =  this.pricelistServ.getPricelistLast().subscribe();
    //      if(priceL){
    //       this.ticketPricesPom.IdPriceList = priceL.Id;
    //       this.pricelistServ.addTicketPrices(this.ticketPricesPom).subscribe();
    //      }
          
    //     }
      }
      onSubmit1(pm: TicketPricesPomModel, form: NgForm){
        if(this.validationsForPrice.validate(pm)){
          return;
        }
        this.ticketPricesPom = pm;
        this.datumVazenjaBool = true;
       // this.pricelistServ.addTicketPrices(pm).subscribe();
      }

  nonRegisterUser(): boolean{
    if(localStorage.getItem('role') == null){
      return true;
    }
    else{
      return false;
    }
  }

  LoggedAdmin(): boolean{
    if(localStorage.getItem('role') == "Admin" && this.boolBezvezeZaPoruku && !this.boolBezvezeZaPorukuDenied){
      return true;
    }
    return false;
  }

  NonActiveAdmin(){
    if(localStorage.getItem('role') == "Admin" && !this.boolBezvezeZaPoruku && !this.boolBezvezeZaPorukuDenied){
      return true;
    }
    return false;
  }

  DeniedAdmin(){
    if(localStorage.getItem('role') == "Admin" && this.boolBezvezeZaPorukuDenied){
      return true;
    }
  }

  getSelectedTicket(event){
    if(event.target.value == "TimeLimited" || 
      event.target.value == "Daily" ||
      event.target.value == "Monthly" || 
      event.target.value == "Annual"){
      this.selectedTicket = event.target.value;
    }
  }

  getSelectedPassanger(event){
    if(event.target.value == "Student" || 
      event.target.value == "Pensioner" ||
      event.target.value == "Default" ){
        this.selectedPassanger = event.target.value;
    }
  }

  calculatePrice(){
    this.pomModelForPriceList.PassangerType = this.selectedPassanger;
    this.pomModelForPriceList.TypeOfTicket = this.selectedTicket;
    this.pomModelForPriceList.PriceListId = this.priceList.Id;

    if(this.validations.validate(this.pomModelForPriceList)){
      return;
    }

    this.pricelistServ.calculateTicketPrice(this.pomModelForPriceList).subscribe(d=>{
      this.retPrice = d;
      this.showLabel = true;
      console.log("Ret: ", this.retPrice);
      
    });
  } 
  
  editPricelistClick(){
    this.showPriceInInput = true;
    this.prviAddPL = false;
  }

  checkIsAuthorized(){
    if(this.LoggedAdmin()){
      
      this.userService.getUserData(localStorage.getItem('name')).subscribe(a=>{
        console.log("Userrr: ", a);
        this.userPom = a;
        console.log(this.userPom);
        if(this.userPom.Activated){
          return true;
        }
        else {
          return false;
        }
      })
      
    }
    return false;
  }


}
