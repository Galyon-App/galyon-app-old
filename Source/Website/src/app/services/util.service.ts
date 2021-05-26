/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToasterService } from 'angular2-toaster';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
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
  public havepopup: boolean;
  public popupMessage: any;
  public translations: any[] = [];
  public direction: any;
  public currecny: any;
  public cside: any;
  public userInfo: any;
  public selectedCity = new Subject<any>();
  public cartBtn = new Subject<any>();
  public popupRX = new Subject<any>();
  public city: any;
  public stripe: any;
  public stripeCode: any;

  public paypal: any;
  public paypalCode: any;

  public razor: any;
  public razorCode: any;
  public deviceType: any = 'desktop';

  public dummyProducts: any[] = [];
  public favIds: any[] = [];
  public haveFav: boolean;

  public general: any;

  public twillo: any;
  public logo: any;
  public delivery: any;

  private modalPopup = new Subject<any>();

  public updatePriceOfCart = new Subject<any>();

  public countrys = [
    {
      country_code: 'PH',
      country_name: 'Philippines',
      dialling_code: '63'
    }
  ];

  public user_login: any = '0';
  public home_type: any = '0';
  public reset_pwd: any = '0';

  public header_category: any;

  public active_store: any[] = [];
  constructor(
    public router: Router,
    private toasterService: ToasterService,
    private ngxService: NgxUiLoaderService
  ) { }

  publishAddress(data: any) {
    this.address.next(data);
  }

  publishNewOrder() {
    this.newOrder.next();
  }

  publishModalPopup(data) {
    this.modalPopup.next(data);
  }

  subscribeModalPopup(): Subject<any> {
    return this.modalPopup;
  }

  publishPriceOfCart() {
    this.updatePriceOfCart.next();
  }

  getPriceOfCart(): Subject<any> {
    return this.updatePriceOfCart;
  }

  publishPopup() {
    this.popupRX.next();
  }

  getPopup(): Subject<any> {
    return this.popupRX;
  }

  publishCartBtn() {
    this.cartBtn.next();
  }

  subscribeCartBtn(): Subject<any> {
    return this.cartBtn;
  }

  toast(type, title, msg) {
    this.toasterService.pop(type, title, msg);
  }

  subscribeOrder(): Subject<any> {
    return this.newOrder;
  }

  translate(str) {
    return str;
  }

  publishReview(data: any) {
    this.review.next(data);
  }

  publishProfile(data: any) {
    this.profile.next(data);
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

  setFav(id) {
    this.favIds.push(id);
  }

  removeFav(id) {
    this.favIds = this.favIds.filter(x => x !== id);
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



  getKeys(key): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        resolve(localStorage.getItem(key));
      } catch (error) {
        reject(error);
      }
    });
  }

  clearKeys(key) {
    localStorage.removeItem(key);
  }

  setKeys(key, value): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        resolve(localStorage.setItem(key, value));
      } catch (error) {
        reject(error);
      }
    });
  }

  gerOrder() {
    return this.orders;
  }

  errorMessage(str) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: 'error',
      title: str
    });
  }

  suucessMessage(str) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: 'success',
      title: str
    });
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

  start() {
    this.ngxService.start();
  }

  stop() {
    this.ngxService.stop();
  }

  getString(str) {
    if (this.translations[str]) {
      return this.translations[str];
    }
    return str;
  }
}
