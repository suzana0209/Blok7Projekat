export class ValidTimetableModel{
    dayTypeOk: boolean = true;
    selectedLineOk: boolean = true;

    validate(dayType: string, selectedLine: string){
        let wrong = false;

        if(dayType != null || dayType == ""){
            this.dayTypeOk = false;
            wrong = true;
        }
        else this.dayTypeOk = true;

        if(selectedLine != null || selectedLine == ""){
            this.selectedLineOk = false;
            wrong = true;
        }
        else this.selectedLineOk = true;

        return wrong;
    }
}