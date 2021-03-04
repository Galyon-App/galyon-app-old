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
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {

  dummy: any[] = [];
  reviews: any[] = [];
  constructor(
    public api: ApiService,
    public util: UtilService,
    private navCtrl: NavController
  ) {
    this.getReviews();
  }

  ngOnInit() {
  }

  getReviews() {
    const param = {
      id: localStorage.getItem('uid'),
      where: 'sid = ' + localStorage.getItem('uid')
    };
    this.dummy = Array(10);
    this.api.post('rating/getFromIDs', param).subscribe((data: any) => {
      this.dummy = [];
      console.log(data);
      if (data && data.status === 200) {
        this.reviews = data.data;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  back() {
    this.navCtrl.back();
  }

  getDate(date) {
    return moment(date).format('lll');
  }
}
