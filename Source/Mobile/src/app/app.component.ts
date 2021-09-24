/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UtilService } from './services/util.service';
import { CartService } from './services/cart.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AddressService } from './services/address.service';
import { OptionService } from './services/option.service';
import { MerchantService } from './services/merchant.service';
import { Store } from './models/store.model';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  selectedIndex: any;
  discountValue: any;
  min: any;
  max: any;
  priceFilter = {
    lower: 10,
    upper: 500
  };
  fromFilter: any;

  public appPages: any[] = [];

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    public util: UtilService,
    public cart: CartService,
    private auth: AuthService,
    private router: Router,
    private menuCtrl: MenuController,
    private storage: Storage,
    private user: UserService,
    private address: AddressService,
    private optServ: OptionService,
    public loadCtrl: LoadingController,
    private merchant: MerchantService,
    public appServ: AppService
  ) {
    this.selectedIndex = 0;
    this.initialize();
    this.menuCtrl.enable(false, 'menu1');
  }

  async presentLoading() {
    // this.presentLoading();
    // this.router.events.subscribe((event: Event) => {
    //   if (event instanceof NavigationStart) {
    //       console.log('NavigationStart');
    //   }
    //   if (event instanceof NavigationEnd) {
    //       console.log('NavigationEnd');
    //   }
    //   if (event instanceof NavigationError) {
    //       console.log(event.error);
    //   }
    // });
    const loading = await this.loadCtrl.create({
      showBackdrop: true,
      translucent: false,
      duration: 500
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async initialize() {
    this.platform.ready().then(() => {
      console.log('%c Copyright 2021 © BytesCrafter', 'background: #222; color: #bada55');
      this.statusBar.show();
      this.appServ.setTheme('light');
      this.appPages = this.util.appPage;

      this.optServ.request((response) => {
        if(response) {
          this.util.translations = response.lang;
          localStorage.setItem('language', response.file);

          const manage = response.manage;
          if (manage.app_close === 0 || manage.app_close === '0') {
            this.util.appClosed = true;
            this.util.appClosedMessage = manage.app_close_message;
          } else {
            this.util.appClosed = false;
          }
  
          const settings = response.settings;
          this.util.direction = settings.appDirection;
          this.util.cside = settings.currencySide;
          this.util.currecny = settings.currencySymbol;
          this.util.logo = settings.logo;
          this.util.delivery = settings.delivery;
          this.util.user_login = settings.user_login;
          this.util.reset_pwd = settings.reset_pwd;
          document.documentElement.dir = this.util.direction;
            
          const general = response.general;
          this.util.general = general;
          this.util.general = general;
          this.cart.minOrderPrice = parseFloat(general.min);
          this.cart.shipping = general.shipping;
          this.cart.shippingPrice = parseFloat(general.shippingPrice);
          this.cart.orderTax = parseFloat(general.tax);
          this.cart.freeShipping = parseFloat(general.free);
        } else {
          console.log('app init error');
        }
      });

      if(this.auth.is_authenticated) {
        this.user.request(this.auth.userToken.uuid);
        this.address.request(this.auth.userToken.uuid);
        //TODO: Load all favorites.
        // this.util.haveFav = true;
        // this.util.favIds = data.data[0].ids.split(',');

        //TODO: Register listener to push notifications.
        // if (this.platform.is('cordova')) {
        //   setTimeout(async () => {
        //     await this.oneSignal.startInit(environment.onesignal.appId, environment.onesignal.googleProjectNumber);
        //     this.oneSignal.getIds().then((data) => {
        //       localStorage.setItem('fcm', data.userId);
        //       const uid = localStorage.getItem('uid');
        //       if (uid && uid !== null && uid !== 'null') {
        //         const param = {
        //           id: uid,
        //           fcm_token: data.userId
        //         };
        //         this.api.post('users/edit_profile', param).subscribe((data: any) => {
        //           //console.log('user info=>', data);
        //         }, error => {
        //           console.log(error);
        //         });
        //       }
        //     });
        //     await this.oneSignal.endInit();
        //   }, 1000);
        // }

        if(this.auth.is_merchant) {
          this.merchant.request((stores: Store[]) => {
            //console.log("My Stores", stores);
          })
        }
      }      

      this.platform.backButton.subscribe(async () => {
        if (this.router.url === '/login' || this.router.url === '/user/home') {
          navigator['app'].exitApp();
        } else {
          console.log('do nothing...');
        }
      });
    });
  }

  getTranslate(str) {
    return this.util.getString(str);
  }
}
