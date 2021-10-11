/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { VerifyPage } from '../verify/verify.page';
import Swal from 'sweetalert2';
import { AppService } from 'src/app/services/app.service';
import { ActivatePage } from '../activate/activate.page';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  verify_uuid: any = '';
  verify_email: any = '';

  email: any = '';
  fname: any = '';
  lname: any = '';
  gender: any = '1';
  
  mobile: any = '';
  password: any = '';
  loggedIn: boolean;
  check: boolean;
  cc: any = '';
  ccCode: any = '';
  countries: any[] = [];
  dummy: any[] = [];

  isRegistering: boolean = false;

  constructor(
    private navCtrl: NavController,
    public util: UtilService,
    private router: Router,
    private api: ApiService,
    private iab: InAppBrowser,
    private auth: AuthService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private appSev: AppService,
    private route: ActivatedRoute
  ) {
    this.dummy = this.util.countrys;
    this.route.queryParams.subscribe((data) => {
      if (data && data.uuid && data.email && data.verify) {
        this.verify_uuid = data.uuid;
        this.verify_email = data.email;
        this.openModal();
      }
    });
  }

  ngOnInit() {
  }

  async openActivation() {
    const modal = await this.modalCtrl.create({
      component: ActivatePage,
      componentProps: {}
    });
    modal.onDidDismiss().then((data) => {
      if (data && data.role === 'success') {
        //Ask through swalk to login or skip.
        //Then auto login.
      }
    });
    modal.present();
  }

  ionViewDidEnter() {
    this.appSev.setAppReady();
  }

  verifyAccount() {
    this.openActivation();
  }

  register() {    
    if (!this.fname || !this.lname || !this.email) {
      this.util.showToast(this.util.getString('All Fields are required'), 'light', 'bottom');
      return false;
    }

    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.util.showToast(this.util.getString('Please enter valid email'), 'light', 'bottom');
      return false;
    }

    if (!this.check) {
      this.util.showToast(this.util.getString('Please accept terms and conditions'), 'light', 'bottom');
      return false;
    }

    this.presentAlertConfirm();
  }

  async openModal() {
    if(!this.verify_uuid && !this.verify_email) {
      this.util.errorToast(this.util.getString('Not valid for Verification!'));
      return;
    }

    const modal = await this.modalCtrl.create({
      component: VerifyPage,
      componentProps: { uuid: this.verify_uuid, email: this.verify_email }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.data && data.role === 'success') {
        Swal.fire({
          title: 'Account Verified',
          text: "Automatically login your account now?",
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: 'grey',
          confirmButtonText: 'Yes, login!',
          cancelButtonText: 'Skip'
        }).then((result) => {
          if (result.isConfirmed) {
            this.auth.setToken = data.data;
            this.router.navigate(['/user/home']);
          }
        })
      }
    });
    modal.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm Registration',
      message: 'We will send verification code to your email: ' + this.email,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Registration');
          }
        }, {
          text: 'Send',
          handler: () => {
            console.log('Confirm Okay');
            this.isRegistering = true;
            this.api.post('galyon/v1/users/registerUser', {
              first_name: this.fname,
              last_name: this.lname,
              email: this.email,
              gender: this.gender,
              //fcm_token: localStorage.getItem('fcm') ? localStorage.getItem('fcm') : 'NA',
            }).subscribe((response: any) => {
              if (response && response.success) {
                this.verify_uuid = response.data.uuid;
                this.verify_email = response.data.email;

                this.fname = '';
                this.lname = '';
                this.email = '';
                this.gender = '';
                this.check = false;

                this.openModal();
              } else {
                this.util.errorToast(response.data.message);
              }
              this.isRegistering = false;
            }, error => {
              console.log(error);
              this.loggedIn = false;
              this.util.errorToast(this.util.getString('Something went wrong'));
              this.isRegistering = false;
            });
          }
        }
      ]
    });

    await alert.present();
  }

  onCountryInput(events) {
    if (events.value !== '') {
      this.countries = this.dummy.filter((item) => {
        return item.country_name.toLowerCase().indexOf(events.detail.value.toLowerCase()) > -1;
      });
    } else {
      this.countries = [];
    }
  }

  selectedCC(item) {
    this.countries = [];
    this.cc = '+' + item.dialling_code + ' ' + item.country_name;
    this.ccCode = '+' + item.dialling_code;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  open(type) {
    this.router.navigate(['about/privacy']);
    // this.iab.create('https://bytescrafter.net/privacy-policy');
  }

  //Check upon registration.
  // if (this.util.twillo === '1') {
    //   console.log('open model=>>>');
    //   const param = {
    //     email: this.email,
    //     phone: this.mobile,
    //     cc: this.ccCode
    //   };
    //   this.loggedIn = true;
    //   this.api.post('users/validatePhoneAndEmail', param).subscribe((data: any) => {
    //     this.loggedIn = false;
    //     console.log('data', data);
    //     if (data && data.status === 200) {
    //       console.log('all done...');
    //       this.presentAlertConfirm();
    //     } else if (data && data.status === 500) {
    //       this.util.errorToast(data.data.message);
    //     } else {
    //       this.util.errorToast(this.util.getString('Something went wrong'));
    //     }
    //   }, error => {
    //     console.log(error);
    //     this.loggedIn = false;
    //     this.util.errorToast(this.util.getString('Something went wrong'));
    //   });
    //   // this.openModal();
    // } else {
    //   console.log('login');
    //   const param = {
    //     first_name: this.fname,
    //     last_name: this.lname,
    //     email: this.email,
    //     password: this.password,
    //     gender: this.gender,
    //     fcm_token: localStorage.getItem('fcm') ? localStorage.getItem('fcm') : 'NA',
    //     type: 'user',
    //     lat: '',
    //     lng: '',
    //     cover: 'NA',
    //     mobile: this.mobile,
    //     status: 1,
    //     country_code: this.ccCode,
    //     verified: 0,
    //     others: 1,
    //     date: moment().format('YYYY-MM-DD'),
    //     stripe_key: ''
    //   };

    //   console.log('param', param);
    //   this.loggedIn = true;
    //   this.api.post('users/registerUser', param).subscribe((data: any) => {
    //     this.loggedIn = false;
    //     console.log(data);
    //     if (data && data.status === 200) {
    //       this.util.userInfo = data.data;
    //       localStorage.setItem('uid', data.data.id);
    //       const fcm = localStorage.getItem('fcm');
    //       if (fcm && fcm !== null && fcm !== 'null') {
    //         const updateParam = {
    //           id: data.data.id,
    //           fcm_token: fcm
    //         };
    //         this.api.post('users/edit_profile', updateParam).subscribe((data: any) => {
    //           console.log('user info=>', data);
    //         }, error => {
    //           console.log(error);
    //         });
    //       }
    //       this.sendVerification(this.email, this.api.baseUrl + 'users/verify?uid=' + data.data.id);
    //       this.navCtrl.navigateRoot(['']);

    //     } else if (data && data.status === 500) {
    //       this.util.errorToast(data.data.message);
    //     } else {
    //       this.util.errorToast(this.util.getString('Something went wrong'));
    //     }
    //   }, error => {
    //     console.log(error);
    //     this.loggedIn = false;
    //     this.util.errorToast(this.util.getString('Something went wrong'));
    //   });
    // }

  // sendVerification(mail, link) {
  //   const param = {
  //     email: mail,
  //     url: link
  //   };

  //   this.api.post('users/sendVerificationMail', param).subscribe((data) => {
  //     console.log('mail', data);
  //   }, error => {
  //     console.log(error);
  //   });
  // }
}
