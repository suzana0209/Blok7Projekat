import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

 @Injectable()
export class UserLoggedInGuard implements CanActivate {

   constructor(private router: Router) {}

   canActivate() {
    if(!localStorage.jwt) {
      this.router.navigateByUrl('/busLines');
      return false;
    }
    return true;
  }
}