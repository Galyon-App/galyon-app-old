/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, MenuController, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { environment } from 'src/environments/environment';
import { ApiService } from './services/api.service';
import { UtilService } from './services/util.service';
import { CartService } from './services/cart.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';
import { AddressService } from './services/address.service';
import { OptionService } from './services/option.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  public appPages: any[] = [];
  selectedIndex: any;
  discountValue: any;
  min: any;
  max: any;
  priceFilter = {
    lower: 10,
    upper: 500
  };
  fromFilter: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private auth: AuthService,
    private router: Router,
    private menuCtrl: MenuController,
    private storage: Storage,
    private user: UserService,
    private address: AddressService,
    private optServ: OptionService
  ) {
    this.selectedIndex = 0;
    this.initialize();
    this.menuCtrl.enable(false, 'menu1');
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async initialize() {
    this.platform.ready().then(() => {
      console.log('%c Copyright 2021 © BytesCrafter', 'background: #222; color: #bada55');
      this.statusBar.show();
      this.appPages = this.util.appPage;
      document.body.setAttribute('color-theme', 'light');

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

      }

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

      

      // const uid = localStorage.getItem('uid');
      // if (uid && uid !== null && uid !== 'null') {
      //   const param = {
      //     id: uid
      //   };
      //   this.api.post('users/getById', param).subscribe((data: any) => {
      //     if (data && data.status === 200 && data.data && data.data.length) {
      //       
      //     } else {
      //       localStorage.removeItem('uid');
      //     }
      //   }, error => {
      //     console.log(error);
      //   });

      //   this.api.post('favourite/getByUid', param).subscribe((data: any) => {
      //     if (data && data.status === 200 && data.data.length > 0) {
      //       this.util.haveFav = true;
      //       try {
      //         this.util.favIds = data.data[0].ids.split(',');
      //       } catch (error) {
      //         console.log('eroor', error);
      //       }
      //     } else {
      //       this.util.haveFav = false;
      //     }
      //   }, error => {
      //     this.util.haveFav = false;
      //     console.log('fav error', error);
      //   });
      // }

      // this.platform.backButton.subscribe(async () => {
      //   if (this.router.url === '/categories' || this.router.url === '/cart' ||
      //     this.router.url === '/orders' || this.router.url === '/account'
      //     || this.router.url === '/login') {
      //     this.navCtrl.navigateRoot(['/home']);
      //   } else if (this.router.url === '/home' || this.router.url === '/cities') {
      //     navigator['app'].exitApp();
      //   }
      // });
    });
  }

  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot(['/login']);
  }

  getTranslate(str) {
    return this.util.getString(str);
  }
}
