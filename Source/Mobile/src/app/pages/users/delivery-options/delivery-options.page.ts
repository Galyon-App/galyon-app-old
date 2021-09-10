/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { CartService } from 'src/app/services/cart.service';
import { TimeComponent } from 'src/app/components/time/time.component';
import * as moment from 'moment';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-delivery-options',
  templateUrl: './delivery-options.page.html',
  styleUrls: ['./delivery-options.page.scss'],
})
export class DeliveryOptionsPage implements OnInit {

  deliveryOption: any = 'home';

  storeAddress: any[] = [];
  time: any;
  datetime: any;

  constructor(
    private navCtrl: NavController,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private popoverController: PopoverController,
    private router: Router
  ) {
    this.getStoreList();
    this.datetime = 'today';
    this.time = this.util.getString('Today - ') + moment().format('dddd, MMMM Do YYYY');
  }

  ngOnInit() {
  }

  back() {
    this.navCtrl.back();
  }

  getStoreList() {
    const info = [...new Set(this.cart.cart.map(item => item.store_id))];
    console.log('store iddss==================>>', info);
    
    this.api.post('galyon/v1/stores/getStoreByIds', {
      uuids: info.join()
    }).subscribe((response: any) => {
      if (response && response.success && response.data) {
        this.storeAddress = response.data;
        this.cart.stores = this.storeAddress;
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
    // this.api.post('stores/getStoreByIds', param).subscribe((data: any) => {
    //   console.log(data);
    //   if (data && data.status === 200 && data.data.length) {
    //     this.storeAddress = data.data;
    //     this.cart.stores = this.storeAddress;
    //   } else {
    //     this.util.showToast(this.util.getString('No Stores Found'), 'danger', 'bottom');
    //     this.back();
    //   }
    // }, error => {
    //   console.log('error', error);
    //   this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
    // });
  }

  async openTime(ev) {
    const popover = await this.popoverController.create({
      component: TimeComponent,
      event: ev,
      mode: 'ios',
    });
    popover.onDidDismiss().then(data => {
      console.log(data.data);
      if (data.data) {
        if (data.data === 'today') {
          this.datetime = 'today';
          this.time = this.util.getString('Today - ') + moment().format('dddd, MMMM Do YYYY');
        } else {
          this.datetime = 'tomorrow';
          this.time = this.util.getString('Tomorrow - ') + moment().add(1, 'days').format('dddd, MMMM Do YYYY');
        }
      }
    });
    await popover.present();
  }

  payment() {
    this.cart.deliveryAt = this.deliveryOption;
    this.cart.datetime = this.datetime;
    if (this.deliveryOption === 'home') {
      const param: NavigationExtras = {
        queryParams: {
          from: 'cart'
        }
      };
      this.cart.calcuate();
      this.router.navigate(['user/cart/address'], param)
    } else {
      console.log('payment');
      this.cart.calcuate();
      this.router.navigate(['user/cart/payment']);
    }
  }
}
