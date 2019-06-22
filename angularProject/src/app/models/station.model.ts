export class StationModel{
    Id: number;
    Name: string;
    Longitude: number;
    Latitude: number;
    AddressStation: string;
    Checked: boolean = false;
    // Draggable: boolean;



    constructor(nameStation:string, longitude:number, latitude:number, address:string, id:number, c:boolean){
        this.Id = id;
        this.Name = nameStation;
        this.Longitude = longitude;
        this.Latitude = latitude;
        this.AddressStation = address;
        this.Checked = c;
        // this.Draggable = true;
    }
}