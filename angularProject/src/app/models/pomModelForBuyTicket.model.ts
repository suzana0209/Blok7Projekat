export class PomModelForBuyTicket{
    Email: string;
    TypeOfTicket: string;
    PurchaseDate: Date;    

    constructor(email: string, typeOfTicket: string){
        this.Email = email;
        this.TypeOfTicket = typeOfTicket;    
        
    }
}

export class PomModelForAddTicketPayPal{
      pomModelForBuyTicket: PomModelForBuyTicket;
      PayPalModelId : number;

      constructor(pomModel: PomModelForBuyTicket, idd: number){
          this.pomModelForBuyTicket = pomModel;
          this.PayPalModelId = idd;
      }
}




