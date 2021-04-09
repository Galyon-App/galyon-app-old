import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {
  resendCode: boolean;
  textCode: any = '';
  mobile: any;
  id: any;
  userCode: any = '';
  uid: any;
  constructor(
    private api: ApiService,
    public util: UtilService,
    private navParam: NavParams,
    private modalCtrl: ModalController
  ) {

    this.sendOTP();
    setTimeout(() => {
      this.resendCode = true;
    }, 30000);
  }

  close() {
    this.modalCtrl.dismiss('', 'closed');
  }
  ngOnInit() {
  }

  sendOTP() {
    console.log('uid-->>', this.uid);
    this.mobile = this.navParam.get('code') + this.navParam.get('phone');
    console.log(this.mobile);
    const message = 'Your Grocecryee app verification code : ';
    const param = {
      msg: message,
      to: this.mobile
    };
    console.log(param);
    this.util.show();
    this.api.post('users/twilloMessage', param).subscribe((data: any) => {
      console.log(data);
      this.id = data.data.id;
      this.util.hide();
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }
  submit() {

  }
  onOtpChange(event) {
    console.log(event);
    this.userCode = event;
  }

  resend() {
    this.sendOTP();
  }
  continue() {
    console.log(this.userCode);
    console.log('uid-->>', this.uid);
    if (this.userCode === '' || !this.userCode) {
      this.util.errorToast(this.util.getString('Not valid code'));
      return false;
    }
    if (this.userCode) {
      const param = {
        id: this.id,
        otp: this.userCode
      };
      this.util.show();
      this.api.post('users/verifyOTP', param).subscribe((data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status === 200) {
          this.modalCtrl.dismiss('', 'success');
        } else {
          if (data && data.status === 500 && data.data && data.data.message) {
            this.util.errorToast(data.data.message);
            return false;
          }
          this.util.errorToast(this.util.getString('Something went wrong'));
          return false;
        }
      }, error => {
        this.util.hide();
        console.log(error);
        this.util.errorToast(this.util.getString('Something went wrong'));
      });
    } else {
      this.util.errorToast(this.util.getString('Not valid code'));
      return false;
    }
  }
}
