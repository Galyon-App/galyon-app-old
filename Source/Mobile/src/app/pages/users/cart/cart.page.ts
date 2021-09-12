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
    if (this.cart.cart[index].quantiy > 0) {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
      this.cart.addQuantity(this.cart.cart[index].quantiy, product.uuid);
    }
  }

  remove(product, index) {
    if (this.cart.cart[index].quantiy === 1) {
      this.cart.cart[index].quantiy = 0;
      this.cart.removeItem(product.uuid)
    } else {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy - 1;
      this.cart.addQuantity(this.cart.cart[index].quantiy, product.uuid);
    }
  }

  goToPayment() {
    console.log(this.cart.minOrderPrice);

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
    this.router.navigate(['user/cart/delivery-options']);
  }

  back() {
    this.navCtrl.back();
  }

  openCoupon() {
    this.router.navigate(['offers']);
  }

  async variant(item, var_id) {
    //let pid = this.cart.cart.findIndex(item);
    //this.cart.cart[pid]
    const allData = [];
    if (item && item.variations !== '' && item.variations.length > 0 && item.variations[var_id]) {
      let variant = item.variations[var_id];
      variant.items.forEach((element, index) => {
        let title = '';
        let discount_type = variant.items[index].discount_type;
        let discount_amt = variant.items[index].discount;
        let discount_sfx = discount_type == 'percent' ? '%' : ' off';
        let discount_text = discount_type != 'none' ? ' ('+discount_amt+discount_sfx+')' : '';
        if(discount_type == 'none' || discount_amt == '0' || discount_amt == 0) {
          discount_text = '';
        }
        const price = variant.items[index] && variant.items[index].discount ? variant.items[index].discount : variant.items[index].price;
        if (this.util.cside === 'left') {
          title = ' * ' +element.title + ' : +' + this.util.currecny + '' + price + discount_text;
        } else {
          title = ' * ' +element.title + ' : +' + price + '' + this.util.currecny + discount_text;
        }

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
        header: item.name + ': ' + variant.title,
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
