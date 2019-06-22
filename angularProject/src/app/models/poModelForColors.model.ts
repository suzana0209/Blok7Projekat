
export class PoModelForColors{
    IdColor: number;
    IdLine: number;  
    ValueColor: any

    constructor(idC: number, idL: number, v){
        this.IdColor = idC;
        this.IdLine = idL;
        this.ValueColor = v;
    }
}