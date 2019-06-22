import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


 @Injectable()
export class AdminGuard implements CanActivate {

   constructor(private router: Router) {}

   canActivate() {
    if(localStorage.role == 'Admin') {
      return true;
    }
    else {
      this.router.navigateByUrl('/busLines');
      return false;
    }
  }
}