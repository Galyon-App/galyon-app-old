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
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';
import { NavController } from '@ionic/angular';


@Injectable({
    providedIn: 'root'
})
export class cartGuard implements CanActivate {
    constructor(
        private navCtrl: NavController,
        private cart: CartService
    ) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (this.cart.cart && this.cart.cart.length) {
            return true;
        }
        this.navCtrl.navigateRoot(['/tabs/cart']);
        return false;
    }
}
