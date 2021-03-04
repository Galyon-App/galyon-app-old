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
import { NavController, MenuController, ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { SelectCountryPage } from '../select-country/select-country.page';
import { VerifyPage } from '../verify/verify.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: any = '';
  password: any = '';
  loggedIn: boolean;

  mobileCC: any;
  mobileNumber: any;
  mobilePassword: any;
  constructor(
    private menuController: MenuController,
    private router: Router,
    public util: UtilService,
    private navCtrl: NavController,
    private api: ApiService,
    private modalController: ModalController
  ) {
    this.mobileCC = '+91';
    if (!this.util.user_login || this.util.user_login === '') {
      this.util.user_login = '0';
    }
  }

  ngOnInit() {
  }

  login() {
    console.log('login');
    if (!this.email || !this.password) {
      this.util.showToast(this.util.getString('All Fields are required'), 'dark', 'bottom');
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.util.showToast(this.util.getString('Please enter valid email'), 'dark', 'bottom');
      return false;
    }
    this.loggedIn = true;
    const param = {
      email: this.email,
      password: this.password
    };
    this.api.post('drivers/login', param).subscribe((data: any) => {
      this.loggedIn = false;
      console.log(data);
      if (data && data.status === 200) {

        if (data.data.status === '1') {
          localStorage.setItem('uid', data.data.id);
          this.util.userInfo = data.data;
          this.menuController.enable(true);
          const fcm = localStorage.getItem('fcm');
          if (fcm && fcm !== null && fcm !== 'null') {
            const updateParam = {
              id: data.data.id,
              fcm_token: fcm
            };
            this.api.post('users/edit_profile', updateParam).subscribe((data: any) => {
              console.log('user info=>', data);
            }, error => {
              console.log(error);
            });
          }

          this.navCtrl.navigateRoot(['']);
        } else {
          console.log('not valid');
          Swal.fire({
            title: this.util.getString('Error'),
            text: this.util.getString('Your are blocked please contact administrator'),
            icon: 'error',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: this.util.getString('Need Help?'),
            backdrop: false,
            background: 'white'
          }).then(status => {
            if (status && status.value) {
              // localStorage.setItem('helpId', data.data.id);
              // this.router.navigate(['inbox']);
              const inboxParam: NavigationExtras = {
                queryParams: {
                  id: 0,
                  name: this.util.getString('Support'),
                  uid: data.data.id
                }
              };
              this.router.navigate(['inbox'], inboxParam);
            }
          });
        }

      } else if (data && data.status === 500) {
        this.util.errorToast(data.data.message);
      } else {
        this.util.errorToast(this.util.getString('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.loggedIn = false;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });

  }

  ionViewDidEnter() {
    console.log('enter');
    this.menuController.enable(false);
  }

  reset() {
    this.router.navigate(['reset']);
  }

  onPhoneLogin() {
    if (!this.mobileCC || !this.mobileNumber || !this.mobilePassword) {
      this.util.showToast(this.util.getString('All Fields are required'), 'dark', 'bottom');
      return false;
    }
    const param = {
      cc: this.mobileCC,
      mobile: this.mobileNumber,
      password: this.mobilePassword
    };
    console.log('param', param);
    this.loggedIn = true;
    this.api.post('drivers/loginWithPhoneAndPassword', param).subscribe((data: any) => {
      this.loggedIn = false;
      console.log(data);
      if (data && data.status === 200) {
        if (data.data.status === '1') {
          localStorage.setItem('uid', data.data.id);
          this.util.userInfo = data.data;
          const fcm = localStorage.getItem('fcm');
          if (fcm && fcm !== null && fcm !== 'null') {
            const updateParam = {
              id: data.data.id,
              fcm_token: fcm
            };
            this.api.post('driver/edit_profile', updateParam).subscribe((data: any) => {
              console.log('user info=>', data);
            }, error => {
              console.log(error);
            });
          }
          this.navCtrl.navigateRoot(['']);
        } else {
          console.log('not valid');
          Swal.fire({
            title: this.util.getString('Error'),
            text: this.util.getString('Your are blocked please contact administrator'),
            icon: 'error',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: this.util.getString('Need Help?'),
            backdrop: false,
            background: 'white'
          }).then(status => {
            if (status && status.value) {
              // localStorage.setItem('helpId', data.data.id);
              // this.router.navigate(['inbox']);
              const inboxParam: NavigationExtras = {
                queryParams: {
                  id: 0,
                  name: 'Support',
                  uid: data.data.id
                }
              };
              this.router.navigate(['inbox'], inboxParam);
            }
          });
        }

      } else if (data && data.status === 500) {
        this.util.errorToast(data.data.message);
      } else {
        this.util.errorToast(this.util.getString('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.loggedIn = false;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });

  }

  async openCountry() {
    console.log('open ccode');
    const modal = await this.modalController.create({
      component: SelectCountryPage,
      backdropDismiss: false,
      showBackdrop: true,
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.role === 'selected') {
        console.log('ok');
        this.mobileCC = '+' + data.data;
      }
    });
    await modal.present();
  }

  onOTPLogin() {
    if (!this.mobileCC || !this.mobileNumber) {
      this.util.showToast(this.util.getString('All Fields are required'), 'dark', 'bottom');
      return false;
    }
    const param = {
      mobile: this.mobileNumber,
      cc: this.mobileCC
    };
    this.loggedIn = true;
    this.api.post('drivers/checkMobileNumber', param).subscribe((data: any) => {
      this.loggedIn = false;
      console.log(data);
      if (data && data.status === 200) {
        console.log('open modal');
        this.openModal(data.data.id);
      } else if (data && data.status === 500) {
        this.util.errorToast(data.data.message);
      } else {
        this.util.errorToast(this.util.getString('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.loggedIn = false;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  async openModal(uid) {
    console.log('uid', uid);
    const modal = await this.modalController.create({
      component: VerifyPage,
      componentProps: { code: this.mobileCC, phone: this.mobileNumber }
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.role === 'success') {
        const param = {
          id: uid
        };
        this.api.post('drivers/getById', param).subscribe((data: any) => {
          console.log('user data', data);
          if (data && data.status === 200 && data.data && data.data.length) {
            this.util.userInfo = data.data[0];

            if (data.data[0].status === '1') {
              localStorage.setItem('uid', uid);
              const fcm = localStorage.getItem('fcm');
              if (fcm && fcm !== null && fcm !== 'null') {
                const updateParam = {
                  id: uid,
                  fcm_token: fcm
                };
                this.api.post('drivers/edit_profile', updateParam).subscribe((data: any) => {
                  console.log('user info=>', data);
                }, error => {
                  console.log(error);
                });
              }
              this.navCtrl.navigateRoot(['']);
            } else {
              console.log('not valid');
              Swal.fire({
                title: this.util.getString('Error'),
                text: this.util.getString('Your are blocked please contact administrator'),
                icon: 'error',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: this.util.getString('Need Help?'),
                backdrop: false,
                background: 'white'
              }).then(status => {
                if (status && status.value) {
                  const inboxParam: NavigationExtras = {
                    queryParams: {
                      id: 0,
                      name: 'Support',
                      uid: uid
                    }
                  };
                  this.router.navigate(['inbox'], inboxParam);
                }
              });
            }

          } else if (data && data.status === 500) {
            this.util.errorToast(data.data.message);
          } else {
            this.util.errorToast(this.util.getString('Something went wrong'));
          }
        }, error => {
          localStorage.removeItem('uid');
          console.log(error);
        });
      }
    });
    modal.present();
  }
}
