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
import { AlertController, MenuController, ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { SelectCountryPage } from '../select-country/select-country.page';
import { VerifyPage } from '../verify/verify.page';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  div_type;
  sent: boolean;
  email: any;
  otp: any;
  myOPT: any;
  verified: any;
  userid: any;
  password: any;
  repass: any;
  loggedIn: boolean;
  id: any;

  phone: any;
  cc: any = '+91';
  ccCode: any = '+91';
  constructor(
    private api: ApiService,
    public util: UtilService,
    private navCtrl: NavController,
    private modalController: ModalController,
    private alertController: AlertController
  ) {
    this.div_type = 1;
    this.sent = false;
    this.email = '';
    this.otp = '';
    this.password = '';
    this.repass = '';
    this.verified = false;
    if (!this.util.reset_pwd || this.util.reset_pwd === '') {
      this.util.reset_pwd = '0';
    }
    console.log('user login type', this.util.reset_pwd);
  }

  ngOnInit() {
  }

  sendOTP() {
    console.log(this.email, ';sendOTPDriver');
    if (!this.email) {
      this.util.showToast(this.util.getString('email is required'), 'dark', 'bottom');
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.util.showToast(this.util.getString('Please enter valid email'), 'dark', 'bottom');
      return false;
    }
    this.loggedIn = true;
    const param = {
      email: this.email
    };
    this.api.post('users/sendOTP', param).subscribe((data: any) => {
      console.log(data);
      this.loggedIn = false;
      if (data && data.status === 200) {
        this.id = data.data.id;
        this.loggedIn = false;
        this.div_type = 2;
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.util.errorToast(data.data.message);
          return false;
        }
        this.util.errorToast(this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.loggedIn = false;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  verifyOTP() {
    // this.div_type = 3;
    if (!this.otp || this.otp === '') {
      this.util.showToast(this.util.getString('otp is required'), 'dark', 'bottom');
      return false;
    }
    this.loggedIn = true;
    const param = {
      id: this.id,
      otp: this.otp
    };
    this.api.post('users/verifyOTP', param).subscribe((data: any) => {
      console.log(data);
      this.loggedIn = false;
      if (data && data.status === 200) {
        this.loggedIn = false;
        this.div_type = 3;
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.util.errorToast(data.data.message);
          return false;
        }
        this.util.errorToast(this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.loggedIn = false;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  sendEmail() {
    console.log('pwddd0<<<<<<', this.password);
    if (!this.password || !this.repass || this.password === '' || this.repass === '') {
      this.util.errorToast(this.util.getString('All Field are required'));
      return false;
    }
    const param = {
      email: this.email,
      pwd: this.password
    };
    this.loggedIn = true;
    this.api.post('users/update_password', param).subscribe((data: any) => {
      console.log(data);
      this.loggedIn = false;
      if (data && data.status === 200) {
        this.loggedIn = false;
        this.util.errorToast(this.util.getString('Password Updated'));
        this.back();
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.util.errorToast(data.data.message);
          return false;
        }
        this.util.errorToast(this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.loggedIn = false;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  resetPasswordWithPhone() {
    console.log('pwddd0<<<<<<', this.password);
    if (!this.password || !this.repass || this.password === '' || this.repass === '') {
      this.util.errorToast(this.util.getString('All Field are required'));
      return false;
    }
    const param = {
      phone: this.phone,
      pwd: this.password
    };
    this.loggedIn = true;
    this.api.post('users/resetPasswordWithPhone', param).subscribe((data: any) => {
      console.log(data);
      this.loggedIn = false;
      if (data && data.status === 200) {
        this.loggedIn = false;
        this.util.errorToast(this.util.getString('Password Updated'));
        this.back();
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.util.errorToast(data.data.message);
          return false;
        }
        this.util.errorToast(this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.loggedIn = false;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  back() {
    this.navCtrl.back();
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
        this.cc = '+' + data.data;
        this.ccCode = '+' + data.data;
      }
    });
    await modal.present();
  }

  sendOTPOnMobile() {
    const param = {
      phone: this.phone,
      cc: this.ccCode
    };
    this.loggedIn = true;
    this.api.post('users/validatePhoneForReset', param).subscribe((data: any) => {
      this.loggedIn = false;
      console.log('data', data);
      if (data && data.status === 200) {
        console.log('all done...');
        this.presentAlertConfirm();
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

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm Informations',
      message: 'We will send verification code to your mobile number  ' + this.ccCode + this.phone,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Send',
          handler: () => {
            console.log('Confirm Okay');
            this.openModal();
          }
        }
      ]
    });

    await alert.present();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: VerifyPage,
      componentProps: { code: this.ccCode, phone: this.phone }
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.role === 'ok') {
        console.log('verification done...');
        this.div_type = 3;
      }
    });
    modal.present();
  }
}
