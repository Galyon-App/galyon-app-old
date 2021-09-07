/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { CartService } from 'src/app/services/cart.service';
import { CityService } from 'src/app/services/city.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.page.html',
  styleUrls: ['./cities.page.scss'],
})
export class CitiesPage {

  id: any;
  clicked: boolean;
  dummy = Array(10);
  cities: any[] = [];

  constructor(
    public api: ApiService,
    public util: UtilService,
    private navCtrl: NavController,
    public cart: CartService,
    private city: CityService
  ) {
    this.clicked = false;
    const id = this.city.activeCity;
    if (id && id !== null && id !== '') {
      this.id = id;
    } 
    this.getCities();
  }

  getCities() {
    this.api.get('galyon/v1/cities/getAllCities').subscribe((response: any) => {
      if (response && response.success && response.data) {
        this.dummy = [];
        this.cities = response.data.filter(x => x.status === '1');
      } else {
        this.util.errorToast(this.util.getString('No Cities Found'));
      }
    }, error => {
      console.log('error', error);
      this.dummy = [];
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  ionViewDidEnter() {
    console.log('enter');
  }

  selected() {
    this.clicked = true;
    localStorage.setItem('mobile-current-city', this.id);
    const city = this.cities.filter(x => x.uuid === this.id);
    this.util.city = city[0];
    this.util.publishCity(city);

    this.util.clearKeys('cart');
    this.cart.cart = [];
    this.cart.itemId = [];
    this.cart.totalPrice = 0;
    this.cart.grandTotal = 0;
    this.cart.coupon = null;
    this.cart.discount = null;

    this.navCtrl.navigateRoot(['']);
  }
}
