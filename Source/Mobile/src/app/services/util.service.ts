/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController, NavController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from "@auth0/angular-jwt";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  loader: any;
  isLoading = false;
  details: any;
  private address = new Subject<any>();
  private coupon = new Subject<any>();
  private review = new Subject<any>();
  orders: any;
  private changeLocation = new Subject<any>();
  private loggedIn = new Subject<any>();
  private profile = new Subject<any>();
  private newOrder = new Subject<any>();
  public appPage: any[] = [];
  public appClosed: boolean;
  public appClosedMessage: any = '';
  public translations: any[] = [];
  public direction: any;
  public currecny: any;
  public cside: any;
  public userInfo: any;
  public selectedCity = new Subject<any>();

  public stripe: any;
  public stripeCode: any;

  public haveFav: boolean;
  public favIds: any[] = [];

  public general: any;
  public store: any;

  public twillo: any;
  public logo: any;
  public delivery: any;
  public newAddress = new Subject<any>();

  public countrys = [
    {
      country_code: 'PH',
      country_name: 'Philippines',
      dialling_code: '63'
    }
  ];
  public user_login: any = '0';
  public reset_pwd: any = '0';
  public active_store: any[] = [];

  private orderChange = new Subject<any>();
  
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public router: Router,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private storage: Storage
  ) {
    this.appPage = [
      {
        title: 'Home',
        url: 'home',
        icon: 'assets/sidemenu/home.png',
        icon2: 'assets/sidemenu/home2.png',
        icn: 'home-outline'
      },
      {
        title: 'History',
        url: 'orders',
        icon: 'assets/sidemenu/home.png',
        icon2: 'assets/sidemenu/home2.png',
        icn: 'document-text-outline'
      },
      {
        title: 'Profile',
        url: 'account',
        icon: 'assets/sidemenu/user.png',
        icon2: 'assets/sidemenu/user2.png',
        icn: 'person-outline'
      },
      {
        title: 'Language',
        url: 'languages',
        icon: 'assets/sidemenu/language.png',
        icon2: 'assets/sidemenu/language2.png',
        icn: 'language-outline'
      },
      {
        title: 'About',
        url: 'account/about',
        icon: 'assets/sidemenu/info.png',
        icon2: 'assets/sidemenu/info2.png',
        icn: 'alert-circle-outline'
      },
      {
        title: 'Contact us',
        url: 'account/contacts',
        icon: 'assets/sidemenu/contact.png',
        icon2: 'assets/sidemenu/contact2.png',
        icn: 'mail-outline'
      },
      {
        title: 'FAQs',
        url: 'account/faqs',
        icon: 'assets/sidemenu/contact.png',
        icon2: 'assets/sidemenu/contact2.png',
        icn: 'flag-outline'
      },
      {
        title: 'Help',
        url: 'account/help',
        icon: 'assets/sidemenu/contact.png',
        icon2: 'assets/sidemenu/contact2.png',
        icn: 'help-circle-outline'
      },
    ];
  }

  refreshOrder() {
    this.orderChange.next();
  }

  publishAddress(data: any) {
    this.address.next(data);
  }

  setFav(id) {
    this.favIds.push(id);
  }

  removeFav(id) {
    this.favIds = this.favIds.filter(x => x !== id);
  }

  publishNewOrder() {
    this.newOrder.next();
  }

  subscribeOrder(): Subject<any> {
    return this.newOrder;
  }

  publishReview(data: any) {
    this.review.next(data);
  }

  publishProfile(data: any) {
    this.profile.next(data);
  }


  publishNewAddress() {
    this.newAddress.next();
  }

  subscribeNewAddress(): Subject<any> {
    return this.newAddress;
  }


  observProfile(): Subject<any> {
    return this.profile;
  }

  getReviewObservable(): Subject<any> {
    return this.review;
  }

  publishLocation(data) {
    this.changeLocation.next(data);
  }
  subscribeLocation(): Subject<any> {
    return this.changeLocation;
  }

  publishLoggedIn(data) {
    this.loggedIn.next(data);
  }
  subscribeLoggedIn(): Subject<any> {
    return this.loggedIn;
  }

  publishCity(data) {
    this.selectedCity.next(data);
  }

  subscribeCity(): Subject<any> {
    return this.selectedCity;
  }

  getObservable(): Subject<any> {
    return this.address;
  }

  publishCoupon(data: any) {
    this.coupon.next(data);
  }
  
  getCouponObservable(): Subject<any> {
    return this.coupon;
  }

  setOrders(data) {
    this.orders = null;
    this.orders = data;
  }

  openMenu() {
    this.menuCtrl.toggle();
  }

  async getKeys(key) {
    await this.storage.create();
    const returning = await this.storage.get(key);
    return returning;
  }

  clearKeys(key) {
    this.storage.remove(key);
  }

  setKeys(key, value): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.storage.set(key, value)
        .then((data) => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  gerOrder() {
    return this.orders;
  }

  async show(msg?) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: msg,
      spinner: 'bubbles',
    }).then(a => {
      a.present().then(() => {
        //console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async hide() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

  /*
    Show Warning Alert Message
    param : msg = message to display
    Call this method to show Warning Alert,
    */
  async showWarningAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showSimpleAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: '',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  /*
   Show Error Alert Message
   param : msg = message to display
   Call this method to show Error Alert,
   */
  async showErrorAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  /*
     param : email = email to verify
     Call this method to get verify email
     */
  async getEmailFilter(email) {
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(email))) {
      const alert = await this.alertCtrl.create({
        header: 'Warning',
        message: 'Please enter valid email',
        buttons: ['OK']
      });
      await alert.present();
      return false;
    } else {
      return true;
    }
  }


  /*
    Show Toast Message on Screen
     param : msg = message to display, color= background 
     color of toast example dark,danger,light. position  = position of message example top,bottom
     Call this method to show toast message
     */

  async showToast(msg, colors, positon) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: colors,
      position: positon
    });
    toast.present();
  }
  async shoNotification(msg, colors, positon) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 4000,
      color: colors,
      position: positon,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async errorToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  apiErrorHandler(err) {
    // console.log('Error got in service =>', err)
    if (err.status === -1) {
      this.showErrorAlert('Failed To Connect With Server');
    } else if (err.status === 401) {
      this.showErrorAlert('Unauthorized Request!');
      this.navCtrl.navigateRoot('/login');
    } else if (err.status === 500) {
      this.showErrorAlert('Somethimg Went Wrong..');
    }
  }


  makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getString(str) {
    if (this.translations[str]) {
      return this.translations[str];
    }
    return str;
  }

  safeAmount(amount: any = '') {
    return parseFloat(amount).toFixed(2);
  }

  safeText(title: string = '', length: number = null, end: any = '...', empty: string = '') {
    if(title && length) {
      if(title.length > length) {
        if(end === true) {
          end = '...';
        }
        return title.substring(0, length)+end;
      }
      return title;
    }
    return empty;
  }

  jwtDecode(token: string) {
    const jwt = new JwtHelperService();
    return jwt.decodeToken(token);
  }

  getDate(date, format: string = 'll') {
    return moment(date).format(format);
  }
}