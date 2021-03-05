import { Component, OnInit, ViewChild } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { UtilService } from 'src/app/services/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  @ViewChild('content', { static: false }) content: any;
  currentDiv;
  sent: boolean;
  email: any;
  otp: any;
  myOPT: any;
  verified: any;
  userid: any;
  password: any;
  repass: any;
  id: any;

  phone: any;
  cc: any = '91';
  ccCode: any = '91';
  countries: any[] = [];

  resendCode: boolean;
  textCode: any = '';
  mobile: any;
  otp_id: any;
  userCode: any = '';
  uid: any;
  constructor(
    private navCtrl: Location,
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    public util: UtilService,
    private modalService: NgbModal,
  ) {
    this.currentDiv = 1;
    this.sent = false;
    this.email = '';
    this.otp = '';
    this.password = '';
    this.repass = '';
    this.verified = false;
    this.countries = this.util.countrys;
    if (!this.util.reset_pwd || this.util.reset_pwd === '') {
      this.util.reset_pwd = '0';
    }
    console.log('user login type', this.util.reset_pwd);
  }

  ngOnInit(): void {
  }

  login() {
    this.back();
  }


  error(message) {
    const toastOptions: ToastOptions = {
      title: this.util.getString('Error'),
      msg: message,
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }
  success(message) {
    const toastOptions: ToastOptions = {
      title: this.util.getString('Success'),
      msg: message,
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }

  sendOTP() {
    console.log(this.email, ';sendOTPDriver');
    if (!this.email) {
      this.error(this.util.getString('Email is required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.error(this.util.getString('Please enter valid email'));
      return false;
    }
    // this.util.start();
    this.spinner.show();
    const param = {
      email: this.email
    };
    this.api.post('users/sendOTP', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        this.id = data.data.id;
        this.spinner.hide();
        this.currentDiv = 2;
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          // this.error(data.data.message);
          this.error(data.data.message);
          return false;
        }
        // this.error('Something went wrong');
        this.error(this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.util.getString('Something went wrong'));
    });
  }

  verifyOTP() {
    // this.currentDiv = 3;
    if (!this.otp || this.otp === '') {
      // this.util.showToast('otp is required', 'dark', 'bottom');
      this.error(this.util.getString('otp is required'));
      return false;
    }
    this.spinner.show();
    const param = {
      id: this.id,
      otp: this.otp
    };
    this.api.post('users/verifyOTP', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        this.spinner.hide();
        this.currentDiv = 3;
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.error(data.data.message);
          return false;
        }
        this.error(this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.util.getString('Something went wrong'));
    });
  }

  sendEmail() {
    console.log('pwddd0<<<<<<', this.password);
    if (!this.password || !this.repass || this.password === '' || this.repass === '') {
      this.error(this.util.getString('All Field are required'));
      return false;
    }
    const param = {
      email: this.email,
      pwd: this.password
    };
    this.spinner.show();
    this.api.post('users/update_password', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        this.spinner.hide();
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });

        Toast.fire({
          icon: 'success',
          title: this.util.getString('Password Updated')
        });
        this.back();
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.error(data.data.message);
          return false;
        }
        this.error(this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.util.getString('Something went wrong'));
    });
  }

  back() {
    this.navCtrl.back();
  }

  sendOTPOnMobile() {
    const param = {
      phone: this.phone,
      cc: '+' + this.ccCode
    };
    this.spinner.show();
    this.api.post('users/validatePhoneForReset', param).then((data: any) => {
      this.spinner.hide();
      console.log('data', data);
      if (data && data.status === 200) {
        console.log('all done...');
        this.resendCode = false;
        this.sendOTP2();
        setTimeout(() => {
          this.resendCode = true;
        }, 30000);
        this.openModal();
      } else if (data && data.status === 500) {
        this.error(data.data.message);
      } else {
        this.error(this.util.getString('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.util.getString('Something went wrong'));
    });
  }

  sendOTP2() {
    const message = 'Your Grocecryee app verification code : ';
    const param = {
      msg: message,
      to: '+' + this.cc + this.phone
    };
    console.log(param);
    this.spinner.show();
    this.api.post('users/twilloMessage', param).then((data: any) => {
      console.log(data);
      this.id = data.data.id;
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.util.getString('Something went wrong'));
    });
  }
  openModal() {
    try {
      this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    } catch (error) {
      console.log(error);
    }
  }


  resetPasswordWithPhone() {
    console.log('pwddd0<<<<<<', this.password);
    if (!this.password || !this.repass || this.password === '' || this.repass === '') {
      this.error(this.util.getString('All Field are required'));
      return false;
    }
    const param = {
      phone: this.phone,
      pwd: this.password
    };
    this.spinner.show();
    this.api.post('users/resetPasswordWithPhone', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        this.spinner.hide();
        this.error(this.util.getString('Password Updated'));
        this.back();
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.error(data.data.message);
          return false;
        }
        this.error(this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.util.getString('Something went wrong'));
    });
  }

  onOtpChange(event) {
    console.log(event);
    this.userCode = event;
  }


  resend() {
    this.sendOTP2();
  }

  continue() {
    console.log(this.userCode);
    if (this.userCode === '' || !this.userCode) {
      this.error(this.util.getString('Not valid code'));
      return false;
    }
    if (this.userCode) {
      const param = {
        id: this.id,
        otp: this.userCode
      };
      this.spinner.show();
      this.api.post('users/verifyOTP', param).then((data: any) => {
        console.log(data);
        this.spinner.hide();
        if (data && data.status === 200) {
          this.currentDiv = 3;
          this.modalService.dismissAll();
        } else {
          if (data && data.status === 500 && data.data && data.data.message) {
            this.error(data.data.message);
            return false;
          }
          this.error(this.util.getString('Something went wrong'));
          return false;
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
        this.error(this.util.getString('Something went wrong'));
      });
    } else {
      this.error(this.util.getString('Not valid code'));
      return false;
    }
  }
}
