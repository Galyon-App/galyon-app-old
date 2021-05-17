/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
