/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { element } from 'protractor';

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
  public bulkOrder: any[] = [];
  public userOrderTaxByStores: any[] = [];
  
  constructor(
    public api: ApiService,
    public util: UtilService
  ) {
    this.util.getKeys('cart')
      .then((data: any) => {
        if (data && data !== null && data !== 'null') {
          const userCart = data;
          if (userCart && userCart.length > 0) {
            this.cart = userCart;
            //this.itemId = [...new Set(this.cart.map(item => item.uuid))];
            this.calcuate();
          } else {
            this.calcuate();
          }
        } else {
          this.calcuate();
        }
      });
  }
  
  addItem(item) {
    this.cart.push(item);
    this.calcuate();
  }

  addQuantity(quantity, uuid) {
    if (quantity < 0) {
      this.removeItem(uuid);
      return false;
    }
    this.cart.forEach(element => {
      if (element.uuid === uuid) {
        element.quantiy = quantity;
      }
    });
    this.calcuate();
  }

  removeItem(uuid) {
    this.cart = this.cart.filter(x => x.uuid !== uuid);
    this.calcuate();
  }

  clearCart() {
    this.cart = [];
    this.totalPrice = 0;
    this.grandTotal = 0;
    this.coupon = undefined;
    this.discount = 0;
    this.orderPrice = 0;
    this.datetime = undefined;
    this.util.clearKeys('cart');
  }

  calcuate() {
    this.userOrderTaxByStores = [];
    let sub_total: number = 0;
    this.cart.forEach(element => {

      //Determine the Discount of the total items.
      let calcdiscount: number = 0;
      if(element.discount_type == 'fixed') {
        calcdiscount = parseFloat(element.discount) > 0 ? parseFloat(element.discount) * element.quantiy : 0;
      } else if(element.discount_type == 'percent') {
        calcdiscount = parseFloat(element.discount) > 0 ? (parseFloat(element.orig_price) * (parseFloat(element.discount)/100)) * element.quantiy : 0;
      } else {
        calcdiscount = 0;
      }

      //Add the item total to the grand total.
      if(calcdiscount > 0) {
        sub_total += (parseFloat(element.orig_price) * element.quantiy) * calcdiscount;
      } else {
        sub_total += parseFloat(element.orig_price) * element.quantiy;
      }
      
      //Add each variant total to the grand.
      element.variations.forEach(variant => {
        let curVarIndex = variant.current;
        let varPrice = parseFloat(variant.items[curVarIndex].price);
        let varDiscount = parseFloat(variant.items[curVarIndex].discount)/100;

        if(varDiscount > 0) {          
          sub_total += (varPrice - (varPrice*varDiscount)) * element.quantiy
        } else {
          sub_total += varPrice * element.quantiy
        }
      });

    });
    this.totalPrice = sub_total;

    //TODO: Coupons
    this.discount = 0;
    if (this.coupon) {
      const min = parseFloat(this.coupon.min);
      if (this.totalPrice >= min) {
        if (this.coupon && this.coupon.type === 'percent') {
          function percentage(num, per) {
            return (num / 100) * per;
          }
          const totalPrice = percentage(parseFloat(this.totalPrice).toFixed(2), parseFloat(this.coupon.off));
          this.discount = totalPrice.toFixed(2);
          //this.grandTotal = (this.totalPrice - parseFloat(this.discount)) + this.orderTax;
        } else {
          this.discount = this.coupon.off;
          // this.grandTotal = (this.totalPrice - parseFloat(this.discount)) + this.orderTax;
        }
      } else {
        this.coupon = null;
      }
    } else {
      this.grandTotal = this.totalPrice + this.orderTax;
    }

    this.deliveryPrice = 0;
    if (this.deliveryAddress && this.deliveryAt === 'home') {
      let totalKM = 0;
      let taxEach = 0;

      //TODO: Very important computinf the delivery.
      // this.stores.forEach(async (element) => {
      //   const distance = await this.distanceInKmBetweenEarthCoordinates(this.deliveryAddress.lat, this.deliveryAddress.lng,
      //     element.lat, element.lng);
      //   totalKM = totalKM + distance;
      //   // const storeCount = this.stores.length + 1;
      //   taxEach = this.orderTax / this.stores.length;
      //   const extraChargeParam = {
      //     store_id: element.uid,
      //     distance: distance.toFixed(2),
      //     tax: taxEach.toFixed(2),
      //     shipping: this.shipping,
      //     shippingPrice: this.shippingPrice
      //   };
      //   console.log('extraChargeParam', extraChargeParam);
      //   this.userOrderTaxByStores.push(extraChargeParam);
      // });

      //TODO: Very important computinf the delivery after the delivery fee.
      // setTimeout(() => {
      //   console.log('free', this.freeShipping);
      //   console.log('totalprice', this.totalPrice);
      //   if (this.freeShipping > this.totalPrice) {
      //     if (this.shipping === 'km') {
      //       const distancePricer = totalKM * this.shippingPrice;
      //       this.deliveryPrice = Math.floor(distancePricer).toFixed(2);
      //       if (!this.discount || this.discount === null) {
      //         this.discount = 0;
      //       }
      //       this.grandTotal = (this.totalPrice - parseFloat(this.discount)) + this.orderTax + distancePricer;
      //       this.grandTotal = parseFloat(this.grandTotal).toFixed(2);
      //       // console.log('deliveryeeeeeeeee', this.deliveryPrice);
      //     } else {
      //       this.deliveryPrice = this.shippingPrice;
      //       if (!this.discount || this.discount === null) {
      //         this.discount = 0;
      //       }
      //       this.grandTotal = (this.totalPrice - parseFloat(this.discount)) + this.orderTax + this.shippingPrice;
      //       this.grandTotal = parseFloat(this.grandTotal).toFixed(2);
      //     }

      //   } else {
      //     this.deliveryPrice = 0;
      //     if (!this.discount || this.discount === null) {
      //       this.discount = 0;
      //     }
      //     this.grandTotal = (this.totalPrice - parseFloat(this.discount)) + this.orderTax;
      //     this.grandTotal = parseFloat(this.grandTotal).toFixed(2);
      //   }
      // }, 1000);
    } else {
      console.log('no delivery address, no shipping price valid');
      //TODO: Very important computing the delivery and store fee.
      // let taxEach = 0;
      // this.stores.forEach(async (element) => {
      //   taxEach = this.orderTax / this.stores.length;
      //   const extraChargeParam = {
      //     store_id: element.uid,
      //     distance: 0,
      //     tax: taxEach.toFixed(2),
      //     shipping: this.shipping,
      //     shippingPrice: this.shippingPrice
      //   };
      //   console.log(extraChargeParam);
      //   this.userOrderTaxByStores.push(extraChargeParam);
      // });
    }

    this.grandTotal = (this.totalPrice - parseFloat(this.discount)) + parseFloat(this.orderTax);
    this.grandTotal = parseFloat(this.grandTotal).toFixed(2);

    this.saveLocalToStorage();
    //this.createBulkOrder();
  }

  /**
   * Refresh the cart value to the storage,
   */
  saveLocalToStorage() {
    this.util.clearKeys('cart');
    this.util.setKeys('cart', this.cart);
  }

  createBulkOrder() {
    const order = [];
    const ids = [...new Set(this.cart.map(item => item.store_id))];
    ids.forEach(element => {
      const param = {
        id: element,
        order: []
      };
      order.push(param);
    });

    ids.forEach((element, index) => {
      this.cart.forEach(cart => {
        if (cart.store_id === element) {
          order[index].order.push(cart);
        }
      })
    });
    this.bulkOrder = order;
  }

  checkProductInCart(uuid) {
    return this.cart.filter(x => x.uuid === uuid).length > 0 ? true : false;
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
