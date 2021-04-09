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
    this.router.navigate(['driver/account/contact']);
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

  openMenu() {
    this.util.openMenu();
  }

  getName() {
    return this.util.userInfo ? this.util.userInfo.first_name + ' ' + this.util.userInfo.last_name : 'Galyon';
  }

  getEmail() {
    return this.util.userInfo ? this.util.userInfo.email : 'support@bytescrafter.net';
  }

  getCover() {
    return this.util.userInfo ? this.api.mediaURL + this.util.userInfo.cover : '';
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
