/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { ProductsService } from './products.service';
import { OptionService } from './option.service';
import { Option } from '../models/option.model';

@Injectable({
  providedIn: 'root'
})
export class PosService {

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
    this.util.getKeys('pos-cart')
    .then(async (data: any) => {
      if (data && data !== null && data !== 'null' && data.length > 0) {
        this.cart = data;
      }

      await this.cart.forEach(element => {
        this.productServ.getById(element.uuid, (curProduct) => {
          if(curProduct) {
            let quantity: number = element.quantity;
            element.orig_price = curProduct.orig_price;
            element.quantity = quantity;

            //console.log(curProduct);
            //this.saveLocalToStorage();
          }
        })
      });

      await this.optServ.observe.subscribe((option: Option)=> {
        if(option.general) {
          this.orderTax = this.optServ.current.general.tax;
        }
      });

      this.calcuate();
    });
  }

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
    this.util.clearKeys('pos-cart');
  }

  addCoupon(item) {
    this.coupon = item;
    this.calcuate();
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

  saveLocalToStorage() {
    this.util.clearKeys('pos-cart');
    this.util.setKeys('pos-cart', this.cart);
  }

  checkProductInCart(uuid) {
    return this.cart.filter(x => x.uuid === uuid).length > 0 ? true : false;
  }
}
