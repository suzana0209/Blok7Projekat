import { StationModel } from './station.model';

export class PomLineModel{
    Id: number;
    List: StationModel[] = []
    

    constructor(id: number, listOfStatios: StationModel[]){
        this.Id = id;
        this.List = listOfStatios;
    }
}