import { Component, OnInit } from '@angular/core';
import { TicketPricesPomModel } from 'src/app/models/ticketPrice.model';
import { PricelistService } from 'src/app/services/pricelistService/pricelist.service';
import { PriceListModel } from 'src/app/models/priceList.model';
import { NgForm } from '@angular/forms';
import { PomModelForPriceList } from 'src/app/models/pomModelForPriceList.model';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit {

  priceList: any;
  ticketPricesPom: TicketPricesPomModel = new TicketPricesPomModel(0,0,0,0,0,new PriceListModel(new Date(),new Date(),0, []));
  datumVazenjaBool: boolean = false;
  validPrices: TicketPricesPomModel;
  selectedTicket: string = "";
  selectedPassanger: string = "";
  showLabel: boolean = false;

  pomModelForPriceList: PomModelForPriceList = new PomModelForPriceList(0, "", "");

  retPrice: any;

  constructor( private pricelistServ: PricelistService) { 
    this.pricelistServ.getPricelist().subscribe(data => {      
      this.priceList = data; 
      console.log(data);

       this.validPrices = new TicketPricesPomModel(0,0,0,0,0,new PriceListModel(new Date(),new Date(),0, []))
       this.priceList.ListOfTicketPrices.forEach(element => {

        if(element.TypeOfTicketId == 2)
        {
          this.validPrices.Daily = element.Price;
        }
        if(element.TypeOfTicketId == 1)
        {
          this.validPrices.TimeLimited = element.Price;
        }
        if(element.TypeOfTicketId == 3)
        {
          this.validPrices.Monthly = element.Price;
        }
        if(element.TypeOfTicketId == 4)
        {
          this.validPrices.Annual = element.Price;
        }        
      });
     });
     
  }

  ngOnInit() {
  }

  onSubmit(pm: PriceListModel, form: NgForm){
    let priceL : any;
    let bol : boolean = false;
    this.ticketPricesPom.PriceList = pm;
    this.pricelistServ.addPricelist(this.ticketPricesPom).subscribe( x =>{
      console.log(x);
    })
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
    if(localStorage.getItem('role') == "Admin"){
      return true;
    }
    return false;
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

    this.pricelistServ.calculateTicketPrice(this.pomModelForPriceList).subscribe(d=>{
      this.retPrice = d;
      this.showLabel = true;
      console.log("Ret: ", this.retPrice);
      
    });
  }  

}
