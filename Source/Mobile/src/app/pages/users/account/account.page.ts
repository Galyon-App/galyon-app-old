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
import { AuthService } from 'src/app/services/auth.service';
import { AddressService } from 'src/app/services/address.service';
import { MerchantService } from 'src/app/services/merchant.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  get hasStore(): boolean {
    return this.merchant.stores.length > 0;
  }

  manageStore() {
    this.router.navigate(['merchant']);
  }

  constructor(
    private router: Router,
    private navCtrl: NavController,
    public util: UtilService,
    public api: ApiService,
    public cart: CartService,
    public user: UserService,
    private authServ: AuthService,
    private merchant: MerchantService
  ) { 
    this.user.request(this.authServ.userToken.uuid);
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
    this.cart.clearCart();
    this.navCtrl.navigateRoot(['']);
  }

  editProfile() {
    this.router.navigate(['user/account/profile']);
  }

  goToAddress() {
    const param: NavigationExtras = {
      queryParams: {
        from: 'account'
      }
    }
    this.router.navigate(['user/account/address'], param);
  }

  goToFav() {
    this.router.navigate(['user/account/favorite']);
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
