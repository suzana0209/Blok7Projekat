import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

 @Injectable()
export class GuardForUser implements CanActivate {

   constructor(private router: Router) {}
    //Ako je ulogovan ne moze vrsiti registraciju i logovanje
   canActivate() {
    if(localStorage.jwt) {
      this.router.navigateByUrl('/busLines');
      return false;
    }
    return true;
  }
}