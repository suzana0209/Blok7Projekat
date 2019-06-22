export class VehicleModel{
    Id: number;
    RegistrationNumber: string;
    TypeOfVehicle: string
    LineId: number

    constructor(id: number, registrationNumber: string, typeOfVehicle: string, line: number){
        this.Id = id;
        this.RegistrationNumber = registrationNumber;
        this.TypeOfVehicle = typeOfVehicle
        this.LineId = line;
    }

}

