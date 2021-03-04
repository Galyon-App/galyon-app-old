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
import { NavParams, ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
@Component({
  selector: 'app-driver-rating',
  templateUrl: './driver-rating.page.html',
  styleUrls: ['./driver-rating.page.scss'],
})
export class DriverRatingPage implements OnInit {
  id: any;
  name: any;
  rate: any = 2;
  comment: any = '';
  total: any;
  rating: any[] = [];
  way: any;
  constructor(
    private navParam: NavParams,
    private modalCtrl: ModalController,
    public util: UtilService,
    public api: ApiService
  ) {

    this.id = this.navParam.get('id');
    this.name = this.navParam.get('name');
    if (this.navParam.get('way')) {
      this.way = this.navParam.get('way');
    } else {
      this.way = 'order';
    }
    console.log('id', this.id);
    console.log('name', this.name);
    const param = {
      where: 'did = ' + this.id
    }
    this.util.show();
    this.api.post('rating/getFromCount', param).subscribe((data: any) => {
      this.util.hide();
      console.log('data', data);
      if (data && data.status === 200) {
        if (data && data.data && data.data.total) {
          this.total = data.data.total;
          if (data.data.rating) {
            const rats = data.data.rating;
            console.log(rats.split(','));
            this.rating = rats.split(',');
          } else {
            this.rating = [];
          }
        } else {
          this.total = 0;
          this.rating = [];
        }
      } else {
        this.total = 0;
        this.rating = [];
      }
      console.log('total', this.total);
    }, error => {
      console.log(error);
      this.util.hide();
      this.total = 0;
      this.rating = [];
    });
  }

  ngOnInit() {
  }

  close(item) {
    this.modalCtrl.dismiss(item, item);
  }

  onRatingChange(event) {
    console.log(event);
  }

  submit() {
    this.rating.push(this.rate);
    let count = 0;
    const sum = this.rating.reduce((sum, item, index) => {
      item = parseFloat(item);
      console.log(sum, item, index);
      count += item;
      return sum + item * (index + 1);
    }, 0);
    console.log(sum / count);
    const storeRating = (sum / count).toFixed(2);
    console.log('rate', this.rate, this.comment);
    if (this.comment === '') {
      this.util.errorToast(this.util.getString('Something went wrong'));
      return false;
    }
    const param = {
      uid: localStorage.getItem('uid'),
      pid: 0,
      did: this.id,
      sid: 0,
      rate: this.rate,
      msg: this.comment,
      way: this.way,
      status: 1,
      timestamp: moment().format('YYYY-MM-DD')
    };

    this.util.show();
    this.api.post('rating/save', param).subscribe((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status === 200) {
        this.util.showToast(this.util.getString('Rating added'), 'success', 'bottom');
        this.close('success');
      } else {
        this.util.errorToast(this.util.getString('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

}
