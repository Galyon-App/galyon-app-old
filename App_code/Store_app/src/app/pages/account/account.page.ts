/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private router: Router,
    public util: UtilService,
    private api: ApiService) { }

  ngOnInit() {
  }

  editProfile() {
    this.router.navigate(['edit-profile']);
  }

  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot(['/login']);
  }

  getProducts() {
    this.router.navigate(['products']);
  }

  getLanguages() {
    this.router.navigate(['/languages']);
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
    this.router.navigate(['inbox'], param);
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

  goToAbout() {
    this.router.navigate(['about']);
  }

  goToChats() {
    this.router.navigate(['chats']);
  }

  openMenu() {
    this.util.openMenu();
  }

  goFaqs() {
    this.router.navigate(['faqs']);
  }

  goHelp() {
    this.router.navigate(['help']);
  }
}
