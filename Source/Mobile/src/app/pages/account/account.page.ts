/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private router: Router,
    private navCtrl: NavController,
    public util: UtilService,
    public api: ApiService,
    public cart: CartService
  ) { }

  ngOnInit() {
  }

  openMenu() {
    this.util.openMenu();
  }

  ditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  logout() {
    localStorage.clear();
    this.cart.cart = [];
    this.cart.itemId = [];
    this.cart.totalPrice = 0;
    this.cart.grandTotal = 0;
    this.cart.coupon = null;
    this.cart.discount = null;
    this.util.clearKeys('cart');
    this.navCtrl.navigateRoot(['/home']);
  }

  orders() {
    this.router.navigate(['/orders']);
  }

  goToFav() {
    this.router.navigate(['/favorite']);
  }

  goToMethods() {
    this.router.navigate(['/payment-method']);
  }

  goToHistory() {
    this.router.navigate(['/payment-history']);
  }

  goToAbout() {
    this.router.navigate(['/about']);
  }

  editProfile() {
    this.router.navigate(['/profile']);
  }

  getName() {
    return this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name + ' ' + this.util.userInfo.last_name : 'Galyon';
  }

  getEmail() {
    return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'support@galyon.app';
  }

  getProfile() {
    return this.util.userInfo && this.util.userInfo.cover ? this.api.mediaURL + this.util.userInfo.cover : 'assets/imgs/user.png';
  }

  goLangs() {
    this.router.navigate(['languages']);
  }

  goToAddress() {
    const param: NavigationExtras = {
      queryParams: {
        from: 'account'
      }
    }
    this.router.navigate(['address'], param);
  }

  goToContact() {
    this.router.navigate(['contacts']);
  }

  reset() {
    this.router.navigate(['reset-password']);
  }

  goToChats() {
    this.router.navigate(['chats']);
  }

  goToSupport() {
    const param: NavigationExtras = {
      queryParams: {
        id: 0,
        name: 'Support'
      }
    };
    this.router.navigate(['inbox'], param);
  }

  goFaqs() {
    this.router.navigate(['faqs']);
  }

  goHelp() {
    this.router.navigate(['help']);
  }
}
