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
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  get hasStore(): boolean {
    return localStorage.getItem('suid') != null && localStorage.getItem('suid') != '';
  }

  manageStore() {
    this.router.navigate(['/merchant/orders']);
  }

  constructor(
    private router: Router,
    private navCtrl: NavController,
    public util: UtilService,
    public api: ApiService,
    public cart: CartService,
    public user: UserService
  ) { 
    
  }

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
    this.navCtrl.navigateRoot(['']);
  }

  editProfile() {
    this.router.navigate(['/profile']);
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

  goToFav() {
    this.router.navigate(['/favorite']);
  }

  goToSupport() {
    const param: NavigationExtras = {
      queryParams: {
        id: 0,
        name: 'Technical Support'
      }
    };
    this.router.navigate(['user/message/chat'], param);
  }




  reset() {
    this.router.navigate(['reset']);
  }

  goToContact() {
    this.router.navigate(['contacts']);
  }

  goToAbout() {
    this.router.navigate(['about']);
  }

  goFaqs() {
    this.router.navigate(['faqs']);
  }

  goHelp() {
    this.router.navigate(['help']);
  }
}
