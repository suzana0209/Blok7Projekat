import { StationModel } from './station.model';

export class LineModel{
    Id: number;
    RegularNumber: number;
    ListOfStations: StationModel[] = []
    

    constructor(id: number, regularNumber: number, listOfStatios: StationModel[]){
        this.Id = id;
        this.RegularNumber = regularNumber;
        this.ListOfStations = listOfStatios;
    }
}

