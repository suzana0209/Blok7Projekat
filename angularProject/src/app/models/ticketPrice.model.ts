import { PriceListModel } from './priceList.model';

export class TicketPricesPomModel{
    TimeLimited: number;
    Daily: number;
    Monthly: number;
    Annual: number;
    IdPriceList: number;
    PriceList: PriceListModel;
    
    constructor( h: number, d: number,m: number,y: number, idp: number, prl: PriceListModel ){
        this.TimeLimited = h;
        this.Daily = d;
        this.Monthly = m;
        this.Annual = y;
        this.IdPriceList = idp;
        this.PriceList = prl;
    }
} 