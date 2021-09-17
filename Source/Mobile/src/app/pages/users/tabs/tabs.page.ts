/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { City } from 'src/app/models/city.model';
import { CartService } from 'src/app/services/cart.service';
import { CityService } from 'src/app/services/city.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  currentCity: any = '';

  constructor(
    public cart: CartService,
    public util: UtilService,
    private router: Router,
    public city: CityService,
    private chMod: ChangeDetectorRef,
  ) { 
    this.city.getActiveCity((returnCity: City) => {
      if(returnCity) {
        this.currentCity = returnCity.name;
        this.chMod.detectChanges();
      }
    });
  }

  changeCity() {
    this.router.navigate(['cities']);
  }
}
