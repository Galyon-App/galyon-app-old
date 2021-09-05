import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';

@Injectable({
  providedIn: 'root'
})
export class CartGuard implements CanActivate {
  constructor(
    private navCtrl: NavController,
    private cart: CartService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.cart.cart && this.cart.cart.length) {
      return true;
    }
    this.navCtrl.navigateRoot(['/cart']);
    return false;
  }
  
}
