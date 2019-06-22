export class PomModelForBuyTicket{
    Email: string;
    TypeOfTicket: string;
    PurchaseDate: Date;    

    constructor(email: string, typeOfTicket: string){
        this.Email = email;
        this.TypeOfTicket = typeOfTicket;    
        
    }
}
