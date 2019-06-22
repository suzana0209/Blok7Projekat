export class PomModelForPriceList{
    PriceListId: number;
    PassangerType: string;
    TypeOfTicket: string;

    constructor(priceListId: number, passType:string, typeOfTicket: string){
        this.PriceListId = priceListId;
        this.PassangerType = passType;
        this.TypeOfTicket = typeOfTicket;
    }
}