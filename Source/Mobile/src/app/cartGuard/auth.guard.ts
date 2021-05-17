/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
        this.navCtrl.navigateRoot(['/cart']);
        return false;
    }
}
