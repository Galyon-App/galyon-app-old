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
import { ProductsService } from './products.service';
import { OptionService } from './option.service';
import { Option } from '../models/option.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public cart: any[] = [];
  public itemId: any[] = [];
  
  public totalPrice: any = 0;
  public grandTotal: any = 0; //Make this a function.
  public coupon: any;
  public discount: any = 0;
  public orderTax: any = 0;
  public get orderTaxAmt(): any {
    return ((this.totalPrice-this.discount) * (this.orderTax/100)).toFixed(2);
  }
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
    public util: UtilService,
    private productServ: ProductsService,
    private optServ: OptionService
  ) {
   this.optServ.observe.subscribe((option: Option)=> {
     if(option.general) {
        this.orderTax = this.optServ.current.general.tax;
        this.calcuate();
     }
   });

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

        this.cart.forEach(element => {
          this.productServ.getById(element.uuid, (curProduct) => {
            if(curProduct) {
              let quantity: number = element.quantity;

              element.orig_price = curProduct.orig_price;
              element.quantity = quantity;

              //console.log(curProduct);
              this.saveLocalToStorage();
            }
          })
        });
      });
  }

  //TODO: Implement coupon.
  getTotalBillByStore(store_id = '', discounted = false): number {
    let store_total_bill: number = 0.00;

    let store_cart: any[] = this.cart.filter(x => x.store_id == store_id);
    store_cart.forEach(element => {
      let item_price = parseFloat(element.orig_price);
      let item_discount: number = 0;
      if(element.discount_type == 'percent') {
        item_discount = (parseFloat(element.orig_price)*(parseFloat(element.discount)/100));
      } else if(element.discount_type == 'fixed') {
        item_discount = parseFloat(element.discount);
      }
      let item_options: number = 0;
      element.variations.forEach(variant => {
        let varitem = variant.items[variant.current];
          varitem.variant = variant.title;
        let discounts = parseFloat(varitem.price)*(parseFloat(varitem.discount)/100);
        item_options += parseFloat(varitem.price)-discounts;
      });
      let item_quantity = element.quantity;
      
      store_total_bill += ((item_price-item_discount)*item_quantity) 
        + (item_options * item_quantity);
    });

    return store_total_bill;
  }

  getOrderItemObject(store_id) {
    let items = [];
    let order_items: any[] = this.cart.filter(x => x.store_id == store_id);
    order_items.forEach(element => {
      let current = {
        uuid: element.uuid,
        name: element.name,
        price: element.orig_price,
        discount_type: element.discount_type,
        discount: element.discount,
        pcs: element.pcs,
        kg: element.kg,
        gram: element.gram,
        liter: element.liter,
        ml: element.ml,
        category_id: element.category_id,
        subcategory_id: element.subcategory_id,
        quantity: element.quantity,
        variations: element.variations,
      };
      current.variations = [];
      element.variations.forEach(variant => {
        let varitem = variant.items[variant.current];
          varitem.variant = variant.title;
        current.variations.push(varitem);
      });
      items.push(current);
    });
    return items;
  }

  getCouponObjectForOrder() {
    return {
      uuid: this.coupon.uuid,
      name: this.coupon.name,
      descriptions: this.coupon.descriptions,
      type: this.coupon.type,
      off: this.coupon.off,
      min: this.coupon.min,
      upto: this.coupon.upto,
      expires: this.coupon.expires,
    };
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
        element.quantity = quantity;
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
    this.coupon = null;
    this.discount = 0;
    this.orderPrice = 0;
    this.datetime = null;
    this.util.clearKeys('cart');
  }

  calcuate() {
    this.userOrderTaxByStores = [];
    let sub_total: number = 0;

    this.cart.forEach(element => {
      let orig_price: number = parseFloat(element.orig_price);
      let calcdiscount: number = 0;
      if(element.discount_type == 'fixed') {
        calcdiscount = parseFloat(element.discount);
      } else if(element.discount_type == 'percent') {
        calcdiscount = orig_price * (parseFloat(element.discount)/100);
      }
      let opt_prices: number = 0;
      element.variations.forEach(variant => {
        let curVarIndex = variant.current;
        let varPrice: number = parseFloat(variant.items[curVarIndex].price);
        let varDiscount: number = parseFloat(variant.items[curVarIndex].discount)/100;
        opt_prices += varPrice - (varPrice*varDiscount);
      });
      sub_total += ( ((orig_price-calcdiscount)+opt_prices)*element.quantity );
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
          const totalPrice = percentage(parseFloat(this.totalPrice), parseFloat(this.coupon.off));
          this.discount = totalPrice.toFixed(2);
        } else {
          this.discount = parseFloat(this.coupon.off).toFixed(2);
        }
      } else {
        this.coupon = null;
      }
    }

    let current_calculation: number = parseFloat(this.totalPrice) - parseFloat(this.discount);
    current_calculation += parseFloat(this.orderTaxAmt);
    current_calculation += parseFloat(this.deliveryPrice);
    this.grandTotal = current_calculation.toFixed(2);
    this.saveLocalToStorage();
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
