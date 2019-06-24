export class ValidForBuyTicketModel{
    emailForBuyTicketOk: boolean = true;
    typeOfTicketOk: boolean = true;

    validate(mail:string){
        let wrong = false;

        if(mail == null || mail == ""){
            this.emailForBuyTicketOk = false;
            wrong = true;
        }
        else this.emailForBuyTicketOk = true;

        return wrong;
    }

    validateForTypeTicket(typeTicket: string){
        let wrong1 = false;

        if(typeTicket == null || typeTicket == ""){
            this.typeOfTicketOk = false;
            wrong1 = true;
        } else this.typeOfTicketOk = true;

        return wrong1;

    }
}