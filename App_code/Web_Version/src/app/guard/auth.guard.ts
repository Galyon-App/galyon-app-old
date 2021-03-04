/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authServ: ApiService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): any {
    /// Less Secure but faster
    const uid = localStorage.getItem('uid');
    console.log('uid', localStorage.getItem('uid'));
    if (uid && uid != null && uid !== 'null') {
      return true;
    }
    this.router.navigate(['/login']);
  }
}
