import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private router: Router,
    public util: UtilService,
    private api: ApiService) { }

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
    this.router.navigate(['contact']);
  }

  goToSupport() {
    const param: NavigationExtras = {
      queryParams: {
        id: 0,
        name: 'Technical Support'
      }
    };
    this.router.navigate(['chat'], param);
  }


  getName() {
    return localStorage.getItem('name') ? localStorage.getItem('name') : 'Galyon';
  }

  getEmail() {
    return localStorage.getItem('email') ? localStorage.getItem('email') : 'support@bytescrafter.net';
  }

  getCover() {
    return this.util.store && this.util.store.cover ? this.api.mediaURL + this.util.store.cover : 'assets/imgs/user.png';
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
