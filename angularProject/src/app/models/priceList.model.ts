export class PriceListModel{
    Id: number;
    FromTime: Date;
    ToTime: Date;
    ListOfTicketPrices: TicketPricessModel[];

     constructor(Start: Date, End: Date,id: number, tp: TicketPricessModel[] ){
        this.Id = id;
        this.ToTime = End;
        this.FromTime = Start;
        this.ListOfTicketPrices= tp;

     }
}

export class TicketPricessModel{
    Id: number;
    Price: number;
    DayTypeId: number;
    
     constructor( id: number, price:number , dtid: null ){
        this.Id = id;
        this.Price = price;
        this.DayTypeId = dtid;

     }
} 