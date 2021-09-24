import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {

  resendCode: boolean = false;
  textCode: any = '';

  uuid: any = '';
  email: any = '';
  userCode: any = '';

  mobile: any;
  id: any;

  constructor(
    private api: ApiService,
    public util: UtilService,
    private navParam: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
    setTimeout(() => {
      //this.resendCode = true;
    }, 30000);

    this.uuid = this.navParam.get('uuid');
    this.email = this.navParam.get('email');

    if(this.uuid == '' && this.email == '') {
      setTimeout(() => {
        this.close();
      }, 1000);
    }
  }

  ngOnInit() {
  }

  sendOTP() {
    // this.mobile = this.navParam.get('code') + this.navParam.get('phone');
    // console.log('send on this number------<<<<<<<', this.mobile);
    // console.log(this.mobile);
    // const message = 'Your Grocecryee app verification code : ';
    // const param = {
    //   msg: message,
    //   to: this.mobile
    // };
    // console.log(param);
    // this.util.show();
    // this.api.post('users/twilloMessage', param).subscribe((data: any) => {
    //   console.log(data);
    //   this.id = data.data.id;
    //   this.util.hide();
    // }, error => {
    //   console.log(error);
    //   this.util.hide();
    //   this.util.errorToast(this.util.getString('Something went wrong'));
    // });
  }

  onOtpChange(event) {
    this.userCode = event;
  }

  resend() {
    this.sendOTP();
  }

  continue() {
    this.api.post('galyon/v1/users/verifyAccount', {
      uuid: this.uuid,
      email: this.email,
      activation_key: this.userCode,
    }).subscribe((response: any) => {
      if (response && response.success && response.data) {
        this.modalCtrl.dismiss(response.data, 'success')
      } else {
        this.util.errorToast(response.data.message);
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
