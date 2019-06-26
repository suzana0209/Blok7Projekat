import { PomModelForAuthorization } from '../pomModelForAuth.model';

export class ValidForValidateTicketModel{
    ticketIdOk: boolean = true;

    validate(pom: PomModelForAuthorization){
        let wrong = false;
        
        if(pom.Id == null || pom.Id == ""){
            this.ticketIdOk = false;
            wrong = true;
        }
        else this.ticketIdOk = true;

        return wrong;
    }
}