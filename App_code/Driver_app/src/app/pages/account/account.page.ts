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
    public api: ApiService) {

  }

  ngOnInit() {
  }

  editProfile() {
    this.router.navigate(['/edit-profile']);
  }

  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot(['/login']);
  }


  getReviews() {
    this.router.navigate(['/reviews']);
  }

  getLanguages() {
    this.router.navigate(['/languages']);
  }

  changePassword() {
    this.router.navigate(['/reset']);
  }

  share() {

  }

  goToContact() {
    this.router.navigate(['tabs/tab2/contact']);
  }
  openMenu() {
    this.util.openMenu();
  }

  getName() {
    return this.util.userInfo ? this.util.userInfo.first_name + ' ' + this.util.userInfo.last_name : 'Groceryee';
  }

  getEmail() {
    return this.util.userInfo ? this.util.userInfo.email : 'info@app.com';
  }

  getCover() {
    return this.util.userInfo ? this.api.mediaURL + this.util.userInfo.cover : '';
  }

  goToAbout() {
    this.router.navigate(['tabs/tab2/about']);
  }

  goFaqs() {
    this.router.navigate(['tabs/tab2/faqs']);
  }

  goHelp() {
    this.router.navigate(['tabs/tab2/help']);
  }
}
