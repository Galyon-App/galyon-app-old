/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ApiService } from 'src/app/services/api.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  coupon: boolean;
  // totalPrice: any;
  // serviceTax: any;
  deliveryCharge: any;
  // dicount: any;
  grandTotal: any;
  constructor(
    public util: UtilService,
    private alertCtrl: AlertController,
    private router: Router,
    public cart: CartService,
    public api: ApiService,
    private navCtrl: NavController
  ) {

  }

  ngOnInit() {
  }

  openMenu() {
    this.util.openMenu();
  }

  add(product, index) {
    if (this.cart.cart[index].quantity > 0) {
      this.cart.cart[index].quantity = this.cart.cart[index].quantity + 1;
      this.cart.addQuantity(this.cart.cart[index].quantity, product.uuid);
    }
  }

  remove(product, index) {
    if (this.cart.cart[index].quantity === 1) {
      this.cart.cart[index].quantity = 0;
      this.cart.removeItem(product.uuid)
    } else {
      this.cart.cart[index].quantity = this.cart.cart[index].quantity - 1;
      this.cart.addQuantity(this.cart.cart[index].quantity, product.uuid);
    }
  }

  goToPayment() {
    if (this.cart.totalPrice < this.cart.minOrderPrice) {
      let text;
      if (this.util.cside === 'left') {
        text = this.util.currecny + ' ' + this.cart.minOrderPrice;
      } else {
        text = this.cart.minOrderPrice + ' ' + this.util.currecny;
      }
      this.util.errorToast(this.util.getString('Minimum order amount must be') + text + this.util.getString('or more'));
      return false;
    }
    this.router.navigate(['user/cart/payment']);
  }

  back() {
    this.navCtrl.back();
  }

  openCoupon() {
    this.router.navigate(['offers']);
  }

  async variant(item, var_id) {
    const allData = [];
    if (item && item.variations !== '' && item.variations.length > 0 && item.variations[var_id]) {
      let variant = item.variations[var_id];
      variant.items.forEach((element, index) => {

        const price = parseFloat(variant.items[index].price);
        const discount = parseFloat(variant.items[index].discount);
        const discounted = price - (price*(discount/100));
        const sub_price = discount > 0 ? discounted.toFixed(2) : price.toFixed(2);
        const price_text = parseFloat(sub_price) == 0 ? "FREE" : 
          this.util.cside === 'left' ? this.util.currecny+sub_price : sub_price+this.util.currecny;
        const discount_text = discount > 0 ? " ("+discount+"%)" : "";
        let title = ' * ' +element.title + ' : ' + price_text + discount_text;

        const data = {
          name: element.title,
          type: 'radio',
          label: title,
          value: index,
          checked: variant.current === index
        };
        allData.push(data);
      });      

      const alert = await this.alertCtrl.create({
        header: 'Choose ' + variant.title,
        inputs: allData,
        buttons: [
          {
            text: this.util.getString('Cancel'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: this.util.getString('Confirm'),
            handler: (data) => {
              console.log('Confirm Ok', data);
              let prod_index = this.cart.cart.indexOf(item);
              this.cart.cart[prod_index].variations[var_id].current = data;
          
              let cartProduct: any = this.cart.cart.filter( x => x.uuid == item.uuid);
              if(cartProduct.length) {
                cartProduct[0].variations[var_id].current = data;
              }
              this.cart.saveLocalToStorage();
            }
          }
        ]
      });
      await alert.present();
    } else {
      console.log('none');
    }
  }
}
