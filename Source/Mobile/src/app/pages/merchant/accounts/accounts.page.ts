import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { MerchantService } from 'src/app/services/merchant.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit {

  public get store_cover(): any {
    return this.merchant.stores.length > 0 ? this.merchant.stores[0].cover : "";
  }

  constructor(
    private navCtrl: NavController,
    private router: Router,
    public util: UtilService,
    public api: ApiService,
    private user: UserService,
    private merchant: MerchantService
  ) { 

  }

  ngOnInit() {
  }

  logout() {
    this.navCtrl.navigateRoot(['user/account']);
  }

  getProducts() {
    this.router.navigate(['merchant/products']);
  }

  changePassword() {
    this.router.navigate(['forgot']);
  }

  goToContact() {
    this.router.navigate(['contacts']);
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


  getName() {
    return this.merchant.stores.length > 0 ? this.merchant.stores[0].name : "Unknown";
  }

  getEmail() {
    return this.user.getCurrent.first_name + ' ' + this.user.getCurrent.last_name;
  }

  openMenu() {
    this.util.openMenu();
  }
  

  goToChats() {
    this.router.navigate(['chat']);
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
