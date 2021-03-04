import { Router } from '@angular/router';
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('content', { static: false }) content: any;
  email: any = '';
  password: any = '';
  selected: any;
  langs: any[] = [];

  mobileCcode: any = '91';
  mobileNumber: any;
  mobilePassword: any;

  countries: any[] = [];

  resendCode: boolean;
  textCode: any = '';
  id: any;
  userCode: any = '';

  uid: any;
  constructor(
    private router: Router,
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    public util: UtilService,
    private modalService: NgbModal,
  ) {
    this.selected = localStorage.getItem('language');
    this.countries = this.util.countrys;
    if (!this.util.user_login || this.util.user_login === '') {
      this.util.user_login = '0';
    }
    console.log('user login type', this.util.user_login);
  }



  ngOnInit(): void {
  }
  login() {

    if (!this.email || this.email === '' || !this.password || this.password === '') {
      this.error(this.util.getString('All Fields are required'));
      return false;
    }

    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.error(this.util.getString('Please enter valid email'));
      return false;
    }
    const param = {
      email: this.email,
      password: this.password
    };
    this.spinner.show();
    this.api.post('users/login', param).then((data: any) => {
      console.log('datas', data);

      if (data && data.status === 200) {
        if (data && data.data && data.data.type && data.data.type === 'store') {
          localStorage.setItem('uid', data.data.id);
          const store = {
            id: data.data.id
          };
          this.api.post('stores/getByUid', store).then((data: any) => {
            this.spinner.hide();
            console.log('*******************', data);
            if (data && data.status === 200 && data.data && data.data.length) {
              this.util.storeInfo = data.data[0];
              this.router.navigate(['']);
            }
          }, error => {
            this.spinner.hide();
            this.error(this.util.getString('Something went wrong'));
            console.log(error);
          }).catch(error => {
            this.spinner.hide();
            console.log(error);
          });
        } else {
          this.spinner.hide();
          this.error(this.util.getString('access denied'));
          return false;
        }
      } else if (data && data.status === 500) {
        this.spinner.hide();
        if (data.data && data.data.message) {
          this.error(data.data.message);
        } else {
          this.error(this.util.getString('Something went wrong'));
        }
      } else {
        this.error(this.util.getString('Something went wrong'));
      }

    }).catch(error => {
      this.spinner.hide();
      console.log('errror', error);
      this.error(this.util.getString('Something went wrong'));
    });
    // localStorage.setItem('uid', 'admin');
    // localStorage.setItem('type', 'admin');
    // this.router.navigate(['admin']);
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

  reset() {
    this.router.navigate(['reset']);
  }

  changeLng(item) {
    console.log(item);
    localStorage.setItem('language', item.file);
    window.location.reload();
  }

  onPhoneLogin() {
    console.log(this.mobileNumber, this.mobilePassword);
    if (!this.mobileNumber || this.mobileNumber === '' || !this.mobilePassword || this.mobilePassword === '') {
      this.error(this.util.getString('All Fields are required'));
      return false;
    }
    const param = {
      cc: '+' + this.mobileCcode,
      mobile: this.mobileNumber,
      password: this.mobilePassword
    };
    this.spinner.show();
    this.api.post('users/loginWithPhoneAndPassword', param).then((data: any) => {
      this.spinner.hide();
      console.log(data);
      if (data && data.status === 200) {
        if (data && data.data && data.data.type === 'store') {
          if (data.data.status === '1') {
            localStorage.setItem('uid', data.data.id);

            const fcm = localStorage.getItem('fcm');
            if (fcm && fcm !== null && fcm !== 'null') {
              const updateParam = {
                id: data.data.id,
                fcm_token: fcm
              };
              this.api.post('users/edit_profile', updateParam).then((data: any) => {
                console.log('user info=>', data);
              }, error => {
                console.log(error);
              });
            }

            const store = {
              id: data.data.id
            };
            this.api.post('stores/getByUid', store).then((data: any) => {
              this.spinner.hide();
              console.log('*******************', data);
              if (data && data.status === 200 && data.data && data.data.length) {
                this.util.store = data.data[0];
                localStorage.setItem('suid', data.data[0].id);
                this.router.navigate(['']);
              }
            }, error => {
              this.spinner.hide();
              this.error(this.util.getString('Something went wrong'));
              console.log(error);
            });
          } else {
            console.log('not valid');

          }
        } else {
          this.error(this.util.getString('Not valid user'));
        }
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

  openModal(id) {
    try {
      this.uid = id;
      this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    } catch (error) {
      console.log(error);
    }
  }

  sendOTP() {
    const message = 'Your Grocecryee app verification code : ';
    const param = {
      msg: message,
      to: '+' + this.mobileCcode + this.mobileNumber
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

  close() {
    this.modalService.dismissAll();
  }

  onOTPLogin() {

    const param = {
      mobile: this.mobileNumber,
      cc: '+' + this.mobileCcode
    };
    this.spinner.show();
    this.api.post('users/checkMobileNumber', param).then((data: any) => {
      this.spinner.hide();
      console.log(data);
      if (data && data.status === 200) {
        console.log('open modal');
        this.resendCode = false;
        this.sendOTP();
        setTimeout(() => {
          this.resendCode = true;
        }, 30000);
        this.openModal(data.data.id);
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

  resend() {
    this.sendOTP();
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
          this.close();
          this.loginNOw();
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

  loginNOw() {
    const param = {
      id: this.uid
    };
    this.spinner.show();
    this.api.post('users/getById', param).then((data: any) => {
      console.log('user data', data);
      if (data && data.status === 200 && data.data && data.data.length && data.data[0].type === 'store') {

        if (data && data.data && data.data[0].type === 'store') {
          if (data.data[0].status === '1') {
            localStorage.setItem('uid', this.uid);
            const store = {
              id: this.uid
            };
            this.api.post('stores/getByUid', store).then((data: any) => {
              this.spinner.hide();
              console.log('*******************', data);
              if (data && data.status === 200 && data.data && data.data.length) {
                this.util.store = data.data[0];
                localStorage.setItem('suid', data.data[0].id);
                this.router.navigate(['']);
              }
            }, error => {
              this.spinner.hide();
              this.error(this.util.getString('Something went wrong'));
              console.log(error);
            });
          } else {
            console.log('not valid');
            this.spinner.hide();
          }
        } else {
          this.spinner.hide();
          this.error(this.util.getString('Not valid user'));
        }
      } else if (data && data.status === 500) {
        this.error(data.data.message);
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.error(this.util.getString('Something went wrong'));
      }
    }, error => {
      this.spinner.hide();
      localStorage.removeItem('uid');
      console.log(error);
    });
  }

  onOtpChange(event) {
    console.log(event);
    this.userCode = event;
  }
}
