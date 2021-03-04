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
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { Location } from '@angular/common';

@Component({
  selector: 'app-manage-payment',
  templateUrl: './manage-payment.component.html',
  styleUrls: ['./manage-payment.component.css']
})
export class ManagePaymentComponent implements OnInit {
  id: any;
  name: any;
  stripe = {
    test: '',
    live: '',
    code: ''
  };

  paypal = {
    test: '',
    live: '',
    code: ''
  };

  razorPay = {
    test: '',
    live: '',
    code: ''
  };

  payTm = {
    id: '',
    key: '',
    code: ''
  };

  instamojo = {
    key: '',
    token: '',
    code: ''
  };

  paystack = {
    sk: '',
    pk: '',
    code: ''
  };

  flutterwave = {
    pk: '',
    code: ''
  };
  env: any;
  constructor(
    private router: Router,
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    private route: ActivatedRoute,
    private navCtrl: Location
  ) {
    const param = {
      id: localStorage.getItem('uid')
    }
    this.api.auth(param).then((data) => {
      if (data !== true) {
        localStorage.removeItem('uid');
        this.router.navigate(['login']);
      }
    }, error => {
      console.log(error);
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    }).catch((error) => {
      console.log(error);
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    });
    this.route.queryParams.subscribe((data) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.getById();
      }
    });
  }

  getById() {
    const param = {
      id: this.id
    };
    this.spinner.show();
    this.api.post('payments/getById', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200 && data.data.length) {
        const info = data.data[0];
        if (this.id === '1') {
          const stripe = info.creds;
          this.name = info.name;
          this.env = info.env;
          if (stripe) {
            const creds = JSON.parse(stripe);
            this.stripe = creds;
          }
        } else if (this.id === '3') {
          const paypal = info.creds;
          console.log('paypal->', paypal);
          this.name = info.name;
          this.env = info.env;
          if (paypal) {
            const pay = JSON.parse(paypal);
            this.paypal = pay;
            console.log('))))))', pay);
          }
        } else if (this.id === '4') {
          const razor = info.creds;
          console.log('razor', razor);
          this.name = info.name;
          this.env = info.env;
          if (razor) {
            const razorPay = JSON.parse(razor);
            this.razorPay = razorPay;
            console.log('razorpay=>', this.razorPay);
          }
        } else if (this.id === '5') {
          const paytm = info.creds;
          console.log('PayTM Creds=>>>>', paytm);
          this.name = info.name;
          this.env = info.env;
          if (paytm) {
            const payPal = JSON.parse(paytm);
            this.payTm = payPal;
            console.log('payTM INofmatrions', this.payTm);
          }
        } else if (this.id === '6') {
          const insta = info.creds;
          this.name = info.name;
          this.env = info.env;
          if (insta) {
            const instaPay = JSON.parse(insta);
            this.instamojo = instaPay;
            console.log('instaMOJO', this.instamojo);
          }
        } else if (this.id === '7') {
          const paystack = info.creds;
          this.name = info.name;
          this.env = info.env;
          if (paystack) {
            const payStacks = JSON.parse(paystack);
            this.paystack = payStacks;
            console.log('paystack-->>', this.paystack);
          }
        } else if (this.id === '8') {
          const flutterwave = info.creds;
          this.name = info.name;
          this.env = info.env;
          if (flutterwave) {
            const flt = JSON.parse(flutterwave);
            this.flutterwave = flt;
            console.log('flutterwave', this.flutterwave);
          }
        }
      } else {
        this.error('Something went wrong');
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.error('Something went wrong');
    });
  }

  ngOnInit(): void {
  }


  error(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Error'),
      msg: this.api.translate(message),
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
      title: this.api.translate('Success'),
      msg: this.api.translate(message),
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

  update() {
    let param;
    if (this.id === '1') {
      param = {
        id: this.id,
        env: this.env,
        creds: JSON.stringify(this.stripe)
      };
    } else if (this.id === '3') {
      param = {
        id: this.id,
        env: this.env,
        creds: JSON.stringify(this.paypal)
      };
    } else if (this.id === '4') {
      param = {
        id: this.id,
        env: this.env,
        creds: JSON.stringify(this.razorPay)
      };
    } else if (this.id === '5') {
      param = {
        id: this.id,
        env: this.env,
        creds: JSON.stringify(this.payTm)
      };
    } else if (this.id === '6') {
      param = {
        id: this.id,
        env: this.env,
        creds: JSON.stringify(this.instamojo)
      };
    } else if (this.id === '7') {
      param = {
        id: this.id,
        env: this.env,
        creds: JSON.stringify(this.paystack)
      };
    } else if (this.id === '8') {
      param = {
        id: this.id,
        env: this.env,
        creds: JSON.stringify(this.flutterwave)
      };
    }
    this.spinner.show();
    this.api.post('payments/editList', param).then((data) => {
      this.spinner.hide();
      if (data && data.status === 200) {
        this.navCtrl.back();
      } else {
        this.error('Something went wrong');
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error('Something went wrong');
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.error('Something went wrong');
    });
  }

}
