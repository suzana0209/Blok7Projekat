import { StationModel } from './station.model';

export class LineModel{
    Id: number;
    RegularNumber: number;
    ListOfStations: StationModel[] = [];
    Version: number;
    

    constructor(id: number, regularNumber: number, 
        listOfStatios: StationModel[], version? : number){
        this.Id = id;
        this.RegularNumber = regularNumber;
        this.ListOfStations = listOfStatios;
        this.Version = version;
    }
}

