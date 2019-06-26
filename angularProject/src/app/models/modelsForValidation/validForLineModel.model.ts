import { LineModel } from '../line.model';


export class ValidForLineModel{
    regularLineOk: boolean = true;
    regularLineOk0: boolean = true;
    regularLineOkMinus: boolean = true;

    listOfStationsOk: boolean = true;

    validate(lineModel: LineModel){
        let wrong = false;

        if(lineModel.RegularNumber == null || lineModel.RegularNumber.toString() == ""){
            this.regularLineOk = false;
            this.regularLineOk0 = true;
            this.regularLineOkMinus = true;
            wrong = true;
        }
        else{
            if(lineModel.RegularNumber == 0){
                this.regularLineOk0 = false;
                this.regularLineOk = true;
                this.regularLineOkMinus = true;
                wrong = true;
            }
            else if(lineModel.RegularNumber < 0){
                this.regularLineOkMinus = false;
                this.regularLineOk = true;
                this.regularLineOk0 = true;
                wrong = true;
            }
            else{
                this.regularLineOk = true;
                this.regularLineOk0 = true;  //ovo mora zbog ispisa poruka
                this.regularLineOkMinus = true;
            }
        }

        if(lineModel.ListOfStations.length < 2){
            this.listOfStationsOk = false;
            wrong = true;
        }
        else this.listOfStationsOk = true;

        return wrong;
    }

    validateForDelete(lineModel: LineModel){
        let wrong1 = false;

        if(lineModel.RegularNumber == null || lineModel.RegularNumber.toString() == ""){
            this.regularLineOk = false;
            this.regularLineOk0 = true;
            this.regularLineOkMinus = true;
            wrong1 = true;
        }
        else{
            if(lineModel.RegularNumber == 0){
                this.regularLineOk0 = false;
                this.regularLineOk = true;
                this.regularLineOkMinus = true;
                wrong1 = true;
            }
            else if(lineModel.RegularNumber < 0){
                this.regularLineOkMinus = false;
                this.regularLineOk = true;
                this.regularLineOk0 = true;
                wrong1 = true;
            }
            else{
                this.regularLineOk = true;
                this.regularLineOk0 = true;  //ovo mora zbog ispisa poruka
                this.regularLineOkMinus = true;
            }
        }
        return wrong1;
    }
}

export class ValidForEditLineModel{
    idAddedOk: boolean = true;
    addStationPositionOk: boolean = true;

    validate(idAdded: number, addStationPosition: number){
        let wrong2 = false;

        if(idAdded == null || idAdded.toString() == ""){
            this.idAddedOk = false;
            wrong2 = true;
        }
        else this.idAddedOk = true;

        if(addStationPosition == null || addStationPosition.toString() == "string"){
            this.addStationPositionOk = false;
            wrong2 = true;
        }
        else this.addStationPositionOk = true;

        return wrong2;
    }
}