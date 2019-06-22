import { Time } from '@angular/common';

export class TimetableModel{
    //Id: number;
    LineId: number;
    DayId: string;
    Departures: Time


    constructor(lineId: number, dayId: string, departures: Time){
        this.LineId = lineId;
        this.DayId = dayId;
        this.Departures = departures;
    }
}
export class TimetableModel2{
    LineId: number;
    DayId: string;
    Departures: string

    constructor(lineId: number, dayId: string, departures: string){
        this.LineId = lineId;
        this.DayId = dayId;
        this.Departures = departures;
    }
}

export class TimetableModel3{
    LineId: number;
    DayId: string;

    constructor(lineId: number, dayId: string){
        this.LineId = lineId;
        this.DayId = dayId;
    }
}

export class TimetableModel4{
    LineId: number;
    DayId: number;
    Departures: string
    NewDepartures: string

    constructor(lineId: number, dayId: number, departures: string, newDepartures: string){
        this.LineId = lineId;
        this.DayId = dayId;
        this.Departures = departures;
        this.NewDepartures = newDepartures;
    }
}
