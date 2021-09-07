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
import { CityService } from '../services/city.service';


@Injectable({
    providedIn: 'root'
})
export class CityGuard implements CanActivate {
    constructor(
        private router: Router,
        private menuController: MenuController,
        private city: CityService
    ) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const city = this.city.activeCity;
        if (city && city != null && city !== '') {
            this.menuController.enable(true);
            return true;
        }
        this.menuController.enable(false);
        this.router.navigate(['/cities']);
    }
}
