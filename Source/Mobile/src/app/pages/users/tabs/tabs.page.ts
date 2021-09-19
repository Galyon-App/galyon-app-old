/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs, NavController } from '@ionic/angular';
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
  @ViewChild('userTabs', {static: false}) userTabs: IonTabs;

  currentCity: any = '';
  currenturl: any = '';

  constructor(
    public cart: CartService,
    public util: UtilService,
    private router: Router,
    public city: CityService,
    private chMod: ChangeDetectorRef,
    private navCtrl: NavController,
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

  onTabChanged() {
    if(!this.currenturl) {
      this.currenturl = this.router.url;
      return;
    }
    var currentTab: string = this.userTabs.getSelected();
    this.navCtrl.navigateRoot('user/' + currentTab);
  }
}
