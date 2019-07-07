import { TimetableModel2, TimetableModel3, TimetableModel4 } from '../timetable.model';

export class ValidForTimetableModel{

    lineIdOk: boolean = true;
    dayIdOk: boolean = true;
    departuresOk: boolean = true;

    validate(tt: TimetableModel2){
        let wrong = false;
        if(tt.LineId == null || tt.LineId.toString() == ""){
            this.lineIdOk = false;
            wrong = true;
        } 
        else this.lineIdOk = true;

        if(tt.DayId == null || tt.DayId == ""){
            this.dayIdOk = false;
            wrong = true;
        }
        else this.dayIdOk = true;

        if(tt.Departures == null || tt.Departures == ""){
            this.departuresOk = false;
            wrong = true;
        }
        else this.departuresOk = true;

        return wrong;
    }
}

export class ValidForTimetableDeleteModel{
    lineIdOk: boolean = true;
    dayIdOk: boolean = true;

    validate(tt: TimetableModel3){
        let wrong = false;

        if(tt.LineId == null || tt.LineId.toString() == ""){
            this.lineIdOk = false;
            wrong = true;
        }
        else this.lineIdOk = true;

        if(tt.DayId == null || tt.DayId == ""){
            this.dayIdOk = false;
            wrong = true;
        }
        else this.dayIdOk = true;

        return wrong;
    }
}

export class ValidForTimetableEditModel{
    lineIdOk: boolean = true;
    dayIdOk: boolean = true;
    departuresOk: boolean = true;
    newDeparturesOk: boolean = true;

    validate(tt: TimetableModel4){
        let wrong = false;

        if(tt.DayId == null || tt.DayId.toString() == ""){
            this.dayIdOk = false;
            wrong = true;
        }
        else this.dayIdOk = true;

        if(tt.LineId == null || tt.LineId.toString() == ""){
            this.lineIdOk = false;
            wrong = true;
        }
        else this.lineIdOk = true;

        if(tt.Departures == null || tt.Departures == ""){
            this.departuresOk = false;
            wrong = true;
        }
        else this.departuresOk = true;

        if(tt.NewDepartures == "" || tt.NewDepartures == null){
            this.newDeparturesOk = false;
            wrong = true;
        }
        else this.newDeparturesOk = true; 

        return wrong;
    }
}

export class ValidForNewDepModel{
    newDepaturesOk: boolean = true;

    validate(newDep: string){
        let wrong = false;

        if(newDep == null || newDep == ""){
            this.newDepaturesOk = false;
            wrong = true;
        }
        else this.newDepaturesOk = true;

        return wrong;
    }

    

}

















