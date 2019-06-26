import { PomAppUserModel } from '../pomAppUser.model';
import { PomModelForPassword } from '../PomModelForPassword.model';

export class ValidForProfileModel{
    emailOk: boolean = true;
    nameOk: boolean = true;
    lastNameOk: boolean = true;
    streetOk: boolean = true;
    numberOk: boolean = true;
    cityOk: boolean = true;
    birthadayOk: boolean = true;

    emailOk1: boolean = true;

    validate(profileModel: PomAppUserModel){
        let wrong = false;

        if (profileModel.Email == null || profileModel.Email == "") {
            this.emailOk = false;
            this.emailOk1 = true;
            wrong = true;
          }
        else{
            if(profileModel.Email.indexOf('@') < 0){
            this.emailOk1 = false;
            this.emailOk = true;
            wrong = true;
            }else{
            this.emailOk = true;
            this.emailOk1 = true;
            } 
        }

        if (profileModel.Name == null || profileModel.Name == "") {
            this.nameOk = false;
            wrong = true;
          }
          else this.nameOk = true;
      
          if (profileModel.LastName == null || profileModel.LastName == "") {
            this.lastNameOk = false;
            wrong = true;
          }
          else this.lastNameOk = true;
      
          if (profileModel.City == null || profileModel.City == "") {
            this.cityOk = false;
            wrong = true;
          }
          else this.cityOk = true;
    
          if (profileModel.Street == null || profileModel.Street == "") {
            this.streetOk = false;
            wrong = true;
          }
          else this.streetOk = true;
      
          if (profileModel.Number == null || profileModel.Number == "") {
            this.numberOk = false;
            wrong = true;
          }
          else this.numberOk = true;

          if (profileModel.Birthaday == null || profileModel.Birthaday == "") {
            this.birthadayOk = false;
            wrong = true;
          }
          else this.birthadayOk = true;

        return wrong;  

    }
}

export class ValidForChangePassModel{
    oldPasswordOk: boolean = true;
    newPasswordOk: boolean = true;
    confirmPasswordOk: boolean = true;

    validations(pomModel: PomModelForPassword){
        let wrong = false;

        if(pomModel.OldPassword == null || pomModel.OldPassword == ""){
            this.oldPasswordOk = false;
            wrong = true;
        }
        else this.oldPasswordOk = true;

        if(pomModel.NewPassword == null || pomModel.NewPassword == ""){
            this.newPasswordOk = false;
            wrong = true;
        }
        else this.newPasswordOk = true;

        if(pomModel.ConfirmPassword == null || pomModel.ConfirmPassword == ""){
            this.confirmPasswordOk = false;
            wrong = true;
        }
        else this.confirmPasswordOk = true;

        return wrong;
    }

}