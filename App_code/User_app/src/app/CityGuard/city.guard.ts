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
import { MenuController } from '@ionic/angular';


@Injectable({
    providedIn: 'root'
})
export class CityGuard implements CanActivate {
    constructor(
        private router: Router,
        private menuController: MenuController
    ) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const city = localStorage.getItem('city');
        console.log('city', localStorage.getItem('city'));
        if (city && city != null && city !== 'null') {
            this.menuController.enable(true);
            return true;
        }
        this.menuController.enable(false);
        this.router.navigate(['/cities']);
        return false;
    }
}
