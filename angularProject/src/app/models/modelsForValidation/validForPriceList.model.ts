export class ValidForPriceListModel{
    passangerTypeOk: boolean = true;
    typeOfTicketOk: boolean = true;

    // PassangerType: string;
    // TypeOfTicket: string;

    validate(pomModelForPriceList){
        let wrong = false;
        if(pomModelForPriceList.PassangerType == null || pomModelForPriceList.PassangerType == ""){
            this.passangerTypeOk = false;
            wrong = true;
        }else this.passangerTypeOk = true;

        if(pomModelForPriceList.TypeOfTicket == null || pomModelForPriceList.TypeOfTicket == ""){
            this.typeOfTicketOk = false;
            wrong = true;
        }else this.typeOfTicketOk = true;

        return wrong;
    }
}