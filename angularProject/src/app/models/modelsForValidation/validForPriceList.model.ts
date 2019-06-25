import { TicketPricesPomModel } from '../ticketPrice.model';
import { PriceListModel } from '../priceList.model';

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

export class ValidForPriceModel{
    timeLimitedOk: boolean = true;
    timeLimitedOk0: boolean = true;
    timeLimitedOkMinus: boolean = true;

    dailyOk: boolean = true;
    dailyOk0: boolean = true;
    dailyOkMinus: boolean = true;

    monthlyOk: boolean = true;
    monthlyOk0: boolean = true;
    mohtlyOkMinus: boolean = true;

    annualOk: boolean = true;
    annualOk0: boolean = true;
    annualOkMinus: boolean = true;

    validate(pom: TicketPricesPomModel){
        let wrong = false;

        if(pom.TimeLimited == null || pom.TimeLimited.toString() == ""){
            this.timeLimitedOk = false;
            this.timeLimitedOk0 = true;  //ovo mora zbog ispisa poruka
            this.timeLimitedOkMinus = true;
            wrong = true;
        }
        else{
            if(pom.TimeLimited == 0){
                this.timeLimitedOk0 = false;
                this.timeLimitedOk = true;
                this.timeLimitedOkMinus = true;
                wrong = true;
            }
            else if(pom.TimeLimited < 0){
                this.timeLimitedOkMinus = false;
                this.timeLimitedOk = true;
                this.timeLimitedOk0 = true;
                wrong = true;
            }
            else{
                this.timeLimitedOk = true;
                this.timeLimitedOk0 = true;
                this.timeLimitedOkMinus = true;
            }
        }

        if(pom.Monthly == null || pom.Monthly.toString() == ""){
            this.monthlyOk = false;
            this.monthlyOk0 = true;  //ovo mora zbog ispisa poruka
            this.mohtlyOkMinus = true;
            wrong = true;
        }
        else{
            if(pom.Monthly == 0){
                this.monthlyOk0 = false;
                this.monthlyOk = true;
                this.mohtlyOkMinus = true;
                wrong = true;
            }
            else if(pom.Monthly < 0){
                this.mohtlyOkMinus = false;
                this.monthlyOk = true;
                this.monthlyOk0 = true;
                wrong = true;
            }
            else{
                this.monthlyOk = true;
                this.monthlyOk0 = true;  //ovo mora zbog ispisa poruka
                this.mohtlyOkMinus = true;
            }
        }

        if(pom.Daily == null || pom.Daily.toString() == ""){
            this.dailyOk = false;
            this.dailyOk0 = true;  //ovo mora zbog ispisa poruka
            this.dailyOkMinus = true;
            wrong = true;
        }
        else{
            if(pom.Daily == 0){
                this.dailyOk0 = false;
                this.dailyOk = true;
                this.dailyOkMinus = true;
                wrong = true;
            }
            else if(pom.Daily < 0){
                this.dailyOkMinus = false;
                this.dailyOk = true;
                this.dailyOk0 = true;
                wrong = true;
            }
            else{
                this.dailyOk = true;
                this.dailyOk0 = true;  //ovo mora zbog ispisa poruka
                this.dailyOkMinus = true;
            }
        }

        if(pom.Annual == null || pom.Annual.toString() == ""){
            this.annualOk = false;
            this.annualOk0 = true;  //ovo mora zbog ispisa poruka
            this.annualOkMinus = true;
            wrong = true;
        }
        else{
            if(pom.Annual == 0){
                this.annualOk0 = false;
                this.annualOk = true;
                this.annualOkMinus = true;
                wrong = true;
            }
            else if(pom.Annual < 0){
                this.annualOkMinus = false;
                this.annualOk = true;
                this.annualOk0 = true;
                wrong = true;
            }
            else{
                this.annualOk = true;
                this.annualOk0 = true;  //ovo mora zbog ispisa poruka
                this.annualOkMinus = true;
            }
        }
        return wrong;
    }
}

export class ValidForDateTimeInPriceList{
    fromTimeOk: boolean = true;
    toTimeOk: boolean = true;

    validate(pom:PriceListModel){
        let wrong = false;

        if(pom.FromTime == null || pom.FromTime.toString() == ""){
            this.fromTimeOk = false;
            wrong = true;
        }
        else this.fromTimeOk = true;

        if(pom.ToTime == null || pom.ToTime.toString() == ""){
            this.toTimeOk = false;
            wrong = true;
        }
        else this.toTimeOk = true;
        

        return wrong;
    }
}