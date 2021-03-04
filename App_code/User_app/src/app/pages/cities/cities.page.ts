/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.page.html',
  styleUrls: ['./cities.page.scss'],
})
export class CitiesPage implements OnInit {
  dummy = Array(10);
  cities: any[] = [];
  id: any;
  clicked: boolean;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private navCtrl: NavController,
    public cart: CartService
  ) {
    this.clicked = false;
    const id = localStorage.getItem('city');
    if (id && id !== null && id !== 'null') {
      this.id = id;
    }
    this.getCities();
  }

  ngOnInit() {
  }

  getCities() {
    this.api.get('cities').subscribe((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        this.cities = data.data.filter(x => x.status === '1');
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
    console.log('id', this.id);
    this.clicked = true;
    localStorage.setItem('city', this.id);
    const city = this.cities.filter(x => x.id === this.id);
    this.util.city = city[0];
    this.util.publishCity(city);
    this.cart.cart = [];
    this.cart.itemId = [];
    this.cart.totalPrice = 0;
    this.cart.grandTotal = 0;
    this.cart.coupon = null;
    this.cart.discount = null;
    this.util.clearKeys('cart');
    this.navCtrl.navigateRoot(['']);
  }
}
