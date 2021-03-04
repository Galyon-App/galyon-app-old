/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Injectable } from '@angular/core';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cart: any[] = [];
  public itemId: any[] = [];
  public totalPrice: any = 0;
  public grandTotal: any = 0;
  public coupon: any;
  public discount: any = 0;
  public orderTax: any = 0;
  public orderPrice: any;
  public shipping: any;
  public shippingPrice: any = 0;
  public minOrderPrice: any = 0;
  public freeShipping: any = 0;
  public datetime: any;
  public deliveryAt: any;
  public deliveryAddress: any;
  public deliveryPrice: any = 0;
  public stores: any[] = [];


  public havePayment: boolean;
  public haveStripe: boolean;
  public haveRazor: boolean;
  public haveCOD: boolean;
  public havePayPal: boolean;
  public havePayTM: boolean;
  public havePayStack: boolean;
  public haveFlutterwave: boolean;
  public paytmCreds = {
    id: '',
    key: '',
    code: ''
  };

  public paytmENV: any;

  haveInstamojo: boolean;
  instamojo = {
    key: '',
    token: '',
    code: ''
  };
  instaENV: any;

  public paystack = {
    sk: '',
    pk: '',
    code: ''
  };
  public flutterwave = {
    pk: '',
    code: ''
  }
  public userOrderTaxByStores: any[] = [];
  constructor(
    public util: UtilService
  ) {
    const data = localStorage.getItem('cart');
    if (data && data !== null && data !== 'null') {
      const userCart = JSON.parse(data);
      if (userCart && userCart.length > 0) {
        this.cart = userCart;
        this.itemId = [...new Set(this.cart.map(item => item.id))];
        this.calcuate();
      } else {
        this.calcuate();
      }
    } else {
      this.calcuate();
    }

  }



  clearCart() {
    this.cart = [];
    this.itemId = [];
    this.totalPrice = 0;
    this.grandTotal = 0;
    this.coupon = undefined;
    this.discount = 0;
    this.orderPrice = 0;
    this.datetime = undefined;
    this.stores = [];
    this.deliveryAddress = null;
    this.shippingPrice = 0;
    this.deliveryPrice = 0;
    this.util.clearKeys('cart');
  }

  addItem(item) {
    console.log('item to adde', item);
    this.cart.push(item);
    this.itemId.push(item.id);
    this.calcuate();
  }

  addQuantity(quantity, id) {
    console.log('iddd-->>', id);
    console.log('quantity', quantity);
    this.cart.forEach(element => {
      if (element.id === id) {
        element.quantiy = quantity;
      }
    });
    this.calcuate();
  }

  removeItem(id) {
    console.log('remove this item from cart');
    console.log('current cart items', this.cart);
    this.cart = this.cart.filter(x => x.id !== id);
    this.itemId = this.itemId.filter(x => x !== id);

    console.log('====>>>>>>>>>', this.cart);
    console.log('items====>>>', this.itemId);
    if (this.cart.length) {
      this.calcuate();
    } else {
      this.clearCart();
    }
  }

  calcuate() {
    this.userOrderTaxByStores = [];
    let total = 0;
    this.cart.forEach(element => {
      if (element && element.discount === '0') {
        if (element.size === '1' || element.size === 1) {
          if (element.variations[0].items[element.variant].discount && element.variations[0].items[element.variant].discount !== 0) {
            total = total + (parseFloat(element.variations[0].items[element.variant].discount) * element.quantiy);
          } else {
            total = total + (parseFloat(element.variations[0].items[element.variant].price) * element.quantiy);
          }
        } else {
          total = total + (parseFloat(element.original_price) * element.quantiy);
        }
      } else {
        if (element.size === '1' || element.size === 1) {
          if (element.variations[0].items[element.variant].discount && element.variations[0].items[element.variant].discount !== 0) {
            total = total + (parseFloat(element.variations[0].items[element.variant].discount) * element.quantiy);
          } else {
            total = total + (parseFloat(element.variations[0].items[element.variant].price) * element.quantiy);
          }
        } else {
          total = total + (parseFloat(element.sell_price) * element.quantiy);
        }
      }
    });

    this.totalPrice = total;

    if (this.coupon && this.coupon.type) {
      const min = parseFloat(this.coupon.min);
      if (this.totalPrice >= min) {
        if (this.coupon && this.coupon.type === 'per') {
          function percentage(num, per) {
            return (num / 100) * per;
          }
          const totalPrice = percentage(parseFloat(this.totalPrice).toFixed(2), parseFloat(this.coupon.off));
          this.discount = totalPrice.toFixed(2);
          this.grandTotal = (this.totalPrice - parseFloat(this.discount)) + this.orderTax;
        } else {
          this.discount = this.coupon.off;
          this.grandTotal = (this.totalPrice - parseFloat(this.discount)) + this.orderTax;
        }
      } else {
        this.discount = 0;
        this.coupon = null;
      }
    } else {
      this.grandTotal = this.totalPrice + this.orderTax;
    }
    if (this.stores && this.stores.length && this.deliveryAddress && this.deliveryAt === 'home') {
      let totalKM = 0;
      let taxEach = 0;
      this.stores.forEach(async (element) => {
        const distance = await this.distanceInKmBetweenEarthCoordinates(this.deliveryAddress.lat, this.deliveryAddress.lng,
          element.lat, element.lng);
        totalKM = totalKM + distance;
        console.log('total->', element.name, totalKM * this.shippingPrice);
        // const storeCount = this.stores.length + 1;
        taxEach = this.orderTax / this.stores.length;
        const extraChargeParam = {
          store_id: element.uid,
          distance: distance.toFixed(2),
          tax: taxEach.toFixed(2),
          shipping: this.shipping,
          shippingPrice: this.shippingPrice
        };
        console.log(extraChargeParam);
        this.userOrderTaxByStores.push(extraChargeParam);
      });
      console.log('00-->>', this.userOrderTaxByStores);
      setTimeout(() => {
        if (this.freeShipping > this.totalPrice) {
          if (this.shipping === 'km') {
            const distancePricer = totalKM * this.shippingPrice;
            console.log('====================> KM price', distancePricer);
            this.deliveryPrice = Math.floor(distancePricer).toFixed(2);
            this.grandTotal = (this.totalPrice - parseFloat(this.discount)) + this.orderTax + distancePricer;
            this.grandTotal = parseFloat(this.grandTotal).toFixed(2);
            console.log('grand total===>>', this.grandTotal);
          } else {
            this.deliveryPrice = this.shippingPrice;
            this.grandTotal = (this.totalPrice - parseFloat(this.discount)) + this.orderTax + this.shippingPrice;
            this.grandTotal = parseFloat(this.grandTotal).toFixed(2);
          }

        } else {
          this.deliveryPrice = 0;
          this.grandTotal = (this.totalPrice - parseFloat(this.discount)) + this.orderTax;
          this.grandTotal = parseFloat(this.grandTotal).toFixed(2);
        }
      }, 1000);

    } else {
      let taxEach = 0;
      this.stores.forEach(async (element) => {
        taxEach = this.orderTax / this.stores.length;
        const extraChargeParam = {
          store_id: element.uid,
          distance: 0,
          tax: taxEach.toFixed(2),
          shipping: this.shipping,
          shippingPrice: this.shippingPrice
        };
        console.log(extraChargeParam);
        this.userOrderTaxByStores.push(extraChargeParam);
      });
      this.deliveryPrice = 0;
      this.discount = this.discount === null || this.discount === 0 || !this.discount ? 0 : this.discount;
      this.grandTotal = (this.totalPrice - parseFloat(this.discount)) + parseFloat(this.orderTax);
      this.grandTotal = parseFloat(this.grandTotal).toFixed(2);
    }
    if (isNaN(this.grandTotal)) {
      // this.util.publishPriceOfCart();
      console.log('its nan value>> current', this);
      console.log('util', this.util);
    }
    console.log('this.grandtotal', this.grandTotal);
    this.util.setKeys('cart', JSON.stringify(this.cart));
  }

  checkProductInCart(id) {
    return this.itemId.includes(id);
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    console.log(lat1, lon1, lat2, lon2);
    const earthRadiusKm = 6371;

    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }
}
