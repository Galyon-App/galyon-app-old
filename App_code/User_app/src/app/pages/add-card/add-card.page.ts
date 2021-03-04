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
import { NavController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.page.html',
  styleUrls: ['./add-card.page.scss'],
})
export class AddCardPage implements OnInit {
  cnumber: any = '';
  cname: any = '';
  cvc: any = '';
  date: any = '';
  email: any = '';
  constructor(
    private navCtrl: NavController,
    public util: UtilService,
    public api: ApiService
  ) { }

  ngOnInit() {
  }

  back() {
    this.navCtrl.back();
  }

  addcard() {
    if (this.email === '' || this.cname === '' || this.cnumber === '' ||
      this.cvc === '' || this.date === '') {
      // this.util.showToast('All Fields are required', 'danger', 'bottom');
      this.util.showToast(this.util.getString('All Fields are required'), 'danger', 'bottom');
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(this.email))) {
      this.util.showToast(this.util.getString('Please enter valid email'), 'danger', 'bottom');
      return false;
    }
    const year = this.date.split('-')[0];
    const month = this.date.split('-')[1];

    const param = {
      'card[number]': this.cnumber,
      'card[exp_month]': month,
      'card[exp_year]': year,
      'card[cvc]': this.cvc
    };
    this.util.show();
    this.api.externalPost('https://api.stripe.com/v1/tokens', param, this.util.stripe).subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        // this.token = data.id;
        const customer = {
          description: 'Customer for food app',
          source: data.id,
          email: this.email
        };
        this.api.externalPost('https://api.stripe.com/v1/customers', customer, this.util.stripe).subscribe((customer: any) => {
          console.log(customer);
          this.util.hide();
          if (customer && customer.id) {
            // this.cid = customer.id;
            const cid = {
              id: localStorage.getItem('uid'),
              stripe_key: customer.id
            };
            this.updateUser(cid);
          }
        }, error => {
          this.util.hide();
          console.log();
          if (error && error.error && error.error.error && error.error.error.message) {
            this.util.showErrorAlert(error.error.error.message);
            return false;
          }
          this.util.errorToast(this.util.getString('Something went wrong'));
        });
      } else {
        this.util.hide();
      }
    }, (error: any) => {
      console.log(error);
      this.util.hide();
      console.log();
      if (error && error.error && error.error.error && error.error.error.message) {
        this.util.showErrorAlert(error.error.error.message);
        return false;
      }
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  updateUser(param) {
    this.util.show(this.util.getString('updating...'));
    this.api.post('users/edit_profile', param).subscribe((data: any) => {
      this.util.hide();
      console.log(data);
      const getParam = {
        id: localStorage.getItem('uid')
      };
      this.api.post('users/getById', getParam).subscribe((data: any) => {
        console.log('user info=>', data);
        if (data && data.status === 200 && data.data && data.data.length) {
          this.util.userInfo = data.data[0];
          this.navCtrl.back();
        } else {
          this.navCtrl.back();
        }
      }, error => {
        console.log(error);
      });
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  getMaxDate(): string {
    return moment().add('50', 'years').format('YYYY-MM-DD');
  }

  minStartDate(): string {
    return moment().format('YYYY-MM-DD');
  }
}
