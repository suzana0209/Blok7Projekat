
export class PayPalModel{
    Id: number;
    PayementId: string;
    PayerEmail: string;
    PayerName: string;
    PayerSurname: string;
    CreateTime: string;
    CurrencyCode: string;
    Status:string;
    Value: number;

    constructor(paymentId: string, payerEmail:string, 
        payerName:string,
        payerSurname: string, createTime:string, currencyCode: string, 
        status:string, value:number){

        // this.Id = id;
        this.PayementId = paymentId;
        this.PayerEmail = payerEmail;
        this.PayerName = payerName;
        this.PayerSurname = payerSurname;
        this.CreateTime = createTime;
        this.CurrencyCode = currencyCode;
        this.Status = status;
        this.Value = value;
    }
}