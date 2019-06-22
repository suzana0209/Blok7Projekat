export class ValidForRegistrationModel {
    emailOk: boolean = true;
    nameOk: boolean = true;
    lastNameOk: boolean = true;
    cityOk: boolean = true;
    streetOk: boolean = true;
    numberOk: boolean = true;
    userTypeOk: boolean = true;
    passangerTypeOk: boolean = true;
    birthadayOk: boolean = true;
    passwordOk: boolean = true;
    confirmPasswordOk: boolean = true;

    emailOk1: boolean = true;

    validate(registrationData) {
      let wrong = false;
      if (registrationData.Email == null || registrationData.Email == "") {
        this.emailOk = false;
        wrong = true;
      }
      else{
          if(registrationData.Email.indexOf('@') < 0){
            this.emailOk1 = false;
            wrong = true;
          }else{
            this.emailOk = true;
            this.emailOk1 = true;
          } 
      }         
  
      if (registrationData.Name == null || registrationData.Name == "") {
        this.nameOk = false;
        wrong = true;
      }
      else this.nameOk = true;
  
      if (registrationData.LastName == null || registrationData.LastName == "") {
        this.lastNameOk = false;
        wrong = true;
      }
      else this.lastNameOk = true;
  
      if (registrationData.City == null || registrationData.City == "") {
        this.cityOk = false;
        wrong = true;
      }
      else this.cityOk = true;

      if (registrationData.Street == null || registrationData.Street == "") {
        this.streetOk = false;
        wrong = true;
      }
      else this.streetOk = true;
  
      if (registrationData.Number == null || registrationData.Number == "") {
        this.numberOk = false;
        wrong = true;
      }
      else this.numberOk = true;

      if (registrationData.UserType == null || registrationData.UserType == "") {
        this.userTypeOk = false;
        wrong = true;
      }
      else this.userTypeOk = true;

      if(registrationData.UserType == "AppUser" && (registrationData.PassangerType == null || registrationData.PassangerType == "")){
          this.passangerTypeOk = false;
          wrong = true;
      }
      else this.passangerTypeOk = true;

      if (registrationData.Birthaday == null || registrationData.Birthaday == "") {
        this.birthadayOk = false;
        wrong = true;
      }
      else this.birthadayOk = true;

      if (registrationData.Password == null || registrationData.Password == "") {
        this.passwordOk = false;
        wrong = true;
      }
      else this.passwordOk = true;

      if (registrationData.ConfirmPassword == null || registrationData.ConfirmPassword == "") {
        this.confirmPasswordOk = false;
        wrong = true;
      }
      else this.confirmPasswordOk = true;


      return wrong;
    }
}