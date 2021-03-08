/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
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

  goToSupport() {
    const param: NavigationExtras = {
      queryParams: {
        id: 0,
        name: 'Support'
      }
    };
    this.router.navigate(['inbox'], param);
  }


  getName() {
    return localStorage.getItem('name') ? localStorage.getItem('name') : 'Galyon';
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
