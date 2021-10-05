import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { OptionService } from 'src/app/services/option.service';
import { AuthService } from 'src/app/services/auth.service';
import { TimeComponent } from 'src/app/components/time/time.component';
import { GmapService } from 'src/app/services/gmap.service';
import { StoreService } from 'src/app/services/store.service';
import { AddressService } from 'src/app/services/address.service';
import { OrderService } from 'src/app/services/order.service';
import { General } from 'src/app/models/option.model';
import { PosService } from 'src/app/services/pos.service';
import { OffersPage } from '../../users/offers/offers.page';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {

  havePayment: boolean;
  haveStripe: boolean;
  havePayPal: boolean;
  haveCOD: boolean;
  haveGCash: boolean;
  havePaymongo: boolean;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    public cart: PosService,
    public util: UtilService,
    public api: ApiService,
    private iab: InAppBrowser,
    private popoverController: PopoverController,
    private optServ: OptionService,
    private authServ: AuthService,
    private gmapServ: GmapService,
    private storeServ: StoreService,
    private addressServ: AddressService,
    private orderServ: OrderService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    this.util.getCouponObservable().subscribe((data) => {
      this.cart.calcuate();
    }, error => {
      console.log(error);
    });

    this.optServ.request((response) => {
      this.havePayment = true;
      let payment_method = this.optServ.current.payment;
      this.haveCOD = payment_method.cod_enable == '1' ? true : true;
      this.havePayPal = payment_method.paypal_enable == '1' ? true : false;
      this.haveStripe = payment_method.stripe_enable == '1' ? true : false;
      this.haveGCash = payment_method.gcash_enable == '1' ? true : false;
      this.havePaymongo = payment_method.paymongo_enable == '1' ? true : false;
    })    
  }

  async createOrder(method = 'cod') {

    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure you want to complete this transaction?',
      buttons: [
        {
          text: 'Go Back',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Registration');
          }
        }, {
          text: 'Complete',
          handler: async () => {
            console.log('Confirm Okay');
            const store_ids = [...new Set(this.cart.cart.map(item => item.store_id))];

            await store_ids.forEach(async(store_id, index) => {

              //Prepare data
              let orderPackage = {
                uid: 'guest', //Guest optional
                address_id: null, //Set on delivery options.
                store_id: store_id,
                
                items: JSON.stringify(this.cart.getOrderItemObject(store_id)),
                matrix: null,
                factor: null,
                coupon: this.cart.coupon ? JSON.stringify(this.cart.getCouponObjectForOrder()) : '',

                paid_method: method,
              }

              let factor = {
                schedule: moment().format('YYYY-MM-DD HH:mm:ss'),
                delivered: false,
                distance: 0, //meter
                duration: 0, //secs
                tax: this.optServ.current.general.tax,
                ship_mode: this.optServ.current.general.shipping,
                ship_price: this.optServ.current.general.shippingPrice,
                ship_base: this.optServ.current.general.shippingBase,
                min_order: this.optServ.current.general.minimum_order,
                free_delivery: this.optServ.current.general.free_delivery,
                currency_code: this.optServ.current.settings.currency_code
              };
              orderPackage.factor = JSON.stringify(factor);
            
              //TODO: You can do better than this.
              let orderStatus = await this.orderServ.submitOrder(orderPackage);
              if(orderStatus) {
                this.util.errorToast(this.util.getString('Order submitted successfully.'));
              } else {
                this.util.errorToast(this.util.getString('Order submission failed.'));
              }

              if((index+1) == store_ids.length) {
                this.cart.clearCart();
                this.modalController.dismiss(null, 'success');
              } else {
                this.modalController.dismiss(null, 'failed');
              }
            });  
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
  }

  back() {
    this.modalController.dismiss();
  }

  async openCoupon() {
    const modal = await this.modalController.create({
      component: OffersPage,
      componentProps: { from: 'pos-pay' }
    });

    modal.onDidDismiss().then((data) => {
      if(data.role == "submit") {
        this.cart.addCoupon(data.data);
      }
    });
    return await modal.present();
  }

  getTime(time) {
    // const date = moment().format('DD-MM-YYYY');
    // return moment(date + ' ' + time).format('hh:mm a');
    return moment(time, ['h:mm A']).format('hh:mm A');
  }

  paypalPayment() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const param = {
      uid: localStorage.getItem('uid'),
      itemName: 'galyon',
      grandTotal: this.cart.grandTotal,
      dateTime: moment().format('YYYY-MM-DD HH:mm'),
      logo: this.api.mediaURL + this.util.logo
    }
    console.log('to url===>', this.api.JSON_to_URLEncoded(param))
    const url = this.api.baseUrl + 'paypal/buyProduct?' + this.api.JSON_to_URLEncoded(param);
    const browser: any = this.iab.create(url, '_blank', options);
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success') || navUrl.includes('checkout/done')) {
        console.log('close');
        browser.close();
      }
    });
  }

  openStripe() {
    this.router.navigate(['user/cart/stripe-payments']);
  }

  getName() {
    return this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name + ' ' + this.util.userInfo.last_name : 'Galyon';
  }

  getEmail() {
    return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'support@galyon.app';
  }

  cardInfo(val) {

  }

  goToSucess() {
    this.router.navigate(['/success']);
  }

  getItemPrice(item, quantity = 1){
    if(item) {
      let sell_price = 0;
      const item_price = parseFloat(item.orig_price);
      const item_discount = parseFloat(item.discount);
      const item_discounted = item.dicount_type == "percent" ? item_price*(item_discount/100) : item_discount;
      sell_price = item_price-item_discounted;

      item.variations.forEach(pvar => {
        const var_price = parseFloat(pvar.price);
        const var_discount = parseFloat(pvar.discount);
        const var_discounted = var_price-(var_price*(var_discount/100));
        sell_price += var_discounted;
      });
      sell_price *= quantity;

      return sell_price.toFixed(2);
    }
  }

}
