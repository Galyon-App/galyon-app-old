/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
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
    this.router.navigate(['/edit-profile']);
  }

  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot(['/login']);
  }

  getProducts() {
    this.router.navigate(['/tabs/tab3/products']);
  }

  getReviews() {
    this.router.navigate(['/reviews']);
  }

  getLanguages() {
    this.router.navigate(['/languages']);
  }

  changePassword() {
    this.router.navigate(['forgot']);
  }

  goToContact() {
    this.router.navigate(['tabs/tab3/contacts']);
  }


  getName() {
    return localStorage.getItem('name') ? localStorage.getItem('name') : 'Groceryee';
  }

  getEmail() {
    return localStorage.getItem('email') ? localStorage.getItem('email') : 'info@app.com';
  }

  getCover() {
    return this.util.store && this.util.store.cover ? this.api.mediaURL + this.util.store.cover : 'assets/imgs/user.png';
  }

  goToAbout() {
    this.router.navigate(['tabs/tab3/about']);
  }

  goToChats() {
    this.router.navigate(['chats']);
  }

  openMenu() {
    this.util.openMenu();
  }

  goFaqs() {
    this.router.navigate(['tabs/tab3/faqs']);
  }

  goHelp() {
    this.router.navigate(['tabs/tab3/help']);
  }
}
