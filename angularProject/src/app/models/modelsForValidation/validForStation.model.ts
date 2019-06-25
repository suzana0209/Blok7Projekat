import { StationModel } from '../station.model';

export class ValidForAddStationModel{   
    nameOk: boolean = true;
    longitudeOk: boolean = true;
    latitudeOk: boolean = true;
    addressStationOk: boolean = true;

    validate(station: StationModel){
        let wrong = false;

        if(station.Name == null || station.Name == ""){
            this.nameOk = false;
            wrong = true;
        }
        else this.nameOk = true;

        if(station.Latitude == null || station.Latitude.toString() == "" || station.Latitude == 0){
            this.latitudeOk = false;
            wrong = true;
        }
        else this.latitudeOk = true;

        if(station.Longitude == null || station.Longitude.toString() == "" || station.Longitude == 0){
            this.longitudeOk = false;
            wrong = true;
        } else this.longitudeOk = true;

        if(station.AddressStation == null || station.AddressStation == ""){
            this.addressStationOk = false;
            wrong = true;
        }
        else this.addressStationOk = true;

        return wrong;
    }
    
}