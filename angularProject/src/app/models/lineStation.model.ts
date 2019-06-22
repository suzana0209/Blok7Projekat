export class LineStationModel{
    Id: number;
    OrdinalNumber: number;
    StationId: number;
    LineId: number;


    constructor(ordinalNumber: number, stationId: number, lineId: number){
        // this.Id = id;
        this.OrdinalNumber = ordinalNumber;
        this.StationId = stationId;
        this.LineId = lineId;
    }
}