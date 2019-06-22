export class LogInValidations{
    emailOk: boolean = true;
    passwordOk: boolean = true;

    emailOk1: boolean = true;

    validate(loginData) {
      let wrong = false;
      if (loginData.Email == null || loginData.Email == "") {
        this.emailOk = false;
        this.emailOk1 = true;
        wrong = true;
      }
      else{
        if(loginData.Email.indexOf('@') < 0){
            this.emailOk1 = false;
            wrong = true;
          }else{
            this.emailOk = true;
            this.emailOk1 = true;
          } 
      }
  
      if (loginData.Password == null || loginData.Password == "") {
        this.passwordOk = false;
        wrong = true;
      }
      else this.passwordOk = true;

      return wrong;
    }
}