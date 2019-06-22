export class PomModelForPassword{
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;

    constructor(old: string, newP: string, confirm: string){
       this.OldPassword = old;
       this.NewPassword = newP;
       this.ConfirmPassword = confirm;
    }
}