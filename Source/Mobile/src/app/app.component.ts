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
    private router: Router,
    private menuCtrl: MenuController,
    private storage: Storage
  ) {
    this.selectedIndex = 0;
    this.initializeApp();
    this.menuCtrl.enable(false, 'menu1');
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      console.log('%c Copyright 2021 © BytesCrafter', 'background: #222; color: #bada55');

      this.statusBar.show();
      this.appPages = this.util.appPage;
      const lng = localStorage.getItem('language');
      document.body.setAttribute('color-theme', 'light');

      if (!lng || lng === null) {
        this.api.get('users/getDefaultSettings').subscribe((data: any) => {
          if (data && data.status === 200 && data.data) {
            const manage = data.data.manage;
            const language = data.data.lang;
            if (manage && manage.length > 0) {
              if (manage[0].app_close === 0 || manage[0].app_close === '0') {
                this.util.appClosed = true;
                this.util.appClosedMessage = manage[0].message;
              } else {
                this.util.appClosed = false;
              }
            } else {
              this.util.appClosed = false;
            }
            if (language) {
              this.util.translations = language;
              localStorage.setItem('language', data.data.file);
            }
            const settings = data.data.settings;
            if (settings && settings.length > 0) {
              const info = settings[0];
              this.util.direction = info.appDirection;
              this.util.cside = info.currencySide;
              this.util.currecny = info.currencySymbol;
              this.util.logo = info.logo;
              this.util.twillo = info.twillo;
              this.util.delivery = info.delivery;
              this.util.user_login = info.user_login;
              this.util.reset_pwd = info.reset_pwd;
              document.documentElement.dir = this.util.direction;
            } else {
              this.util.direction = 'ltr';
              this.util.cside = 'right';
              this.util.currecny = '$';
              document.documentElement.dir = this.util.direction;
            }

            const general = data.data.general;
            if (general && general.length > 0) {
              const info = general[0];
              this.util.general = info;
              this.cart.minOrderPrice = parseFloat(info.min);
              this.cart.shipping = info.shipping;
              this.cart.shippingPrice = parseFloat(info.shippingPrice);
              this.cart.orderTax = parseFloat(info.tax);
              this.cart.freeShipping = parseFloat(info.free);
            }
          }
        }, error => {
          console.log('default settings', error);
        });
      } else {
        const param = {
          id: localStorage.getItem('language')
        };
        this.api.post('users/getDefaultSettingsById', param).subscribe((data: any) => {
          if (data && data.status === 200 && data.data) {
            const manage = data.data.manage;
            const language = data.data.lang;
            if (manage && manage.length > 0) {
              if (manage[0].app_close === 0 || manage[0].app_close === '0') {
                this.util.appClosed = true;
                this.util.appClosedMessage = manage[0].message;
              } else {
                this.util.appClosed = false;
              }
            } else {
              this.util.appClosed = false;
            }
            if (language) {
              this.util.translations = language;
            }
            const settings = data.data.settings;
            if (settings && settings.length > 0) {
              const info = settings[0];
              this.util.direction = info.appDirection;
              this.util.cside = info.currencySide;
              this.util.currecny = info.currencySymbol;
              this.util.logo = info.logo;
              this.util.twillo = info.twillo;
              this.util.delivery = info.delivery;
              this.util.user_login = info.user_login;
              this.util.reset_pwd = info.reset_pwd;
              document.documentElement.dir = this.util.direction;

            } else {
              this.util.direction = 'ltr';
              this.util.cside = 'right';
              this.util.currecny = '$';
              document.documentElement.dir = this.util.direction;
            }
            const general = data.data.general;
            if (general && general.length > 0) {
              const info = general[0];
              this.util.general = info;
              this.cart.minOrderPrice = parseFloat(info.min);
              this.cart.shipping = info.shipping;
              this.cart.shippingPrice = parseFloat(info.shippingPrice);
              this.cart.orderTax = parseFloat(info.tax);
              this.cart.freeShipping = parseFloat(info.free);
            }
          }
        }, error => {
          this.util.appClosed = false;
          this.util.direction = 'ltr';
          this.util.cside = 'right';
          this.util.currecny = '$';
          document.documentElement.dir = this.util.direction;
        });
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

      const uid = localStorage.getItem('uid');
      if (uid && uid !== null && uid !== 'null') {
        const param = {
          id: uid
        };
        this.api.post('users/getById', param).subscribe((data: any) => {
          if (data && data.status === 200 && data.data && data.data.length) {
            this.util.userInfo = data.data[0];
          } else {
            localStorage.removeItem('uid');
          }
        }, error => {
          console.log(error);
        });

        this.api.post('favourite/getByUid', param).subscribe((data: any) => {
          if (data && data.status === 200 && data.data.length > 0) {
            this.util.haveFav = true;
            try {
              this.util.favIds = data.data[0].ids.split(',');
            } catch (error) {
              console.log('eroor', error);
            }
          } else {
            this.util.haveFav = false;
          }
        }, error => {
          this.util.haveFav = false;
          console.log('fav error', error);
        });
      }

      this.platform.backButton.subscribe(async () => {
        if (this.router.url === '/categories' || this.router.url === '/cart' ||
          this.router.url === '/orders' || this.router.url === '/account'
          || this.router.url === '/login') {
          this.navCtrl.navigateRoot(['/home']);
        } else if (this.router.url === '/home' || this.router.url === '/cities') {
          navigator['app'].exitApp();
        }
      });
    });
  }

  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot(['/login']);
  }

  getTranslate(str) {
    return this.util.getString(str);
  }

  haveSignedIn() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid !== 'null') {
      return true;
    }
    return false;
  }
}
