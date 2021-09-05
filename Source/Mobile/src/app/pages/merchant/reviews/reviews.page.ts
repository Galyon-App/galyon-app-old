/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
    this.getReviews(null);
  }

  ngOnInit() {
  }

  getReviews(event) {
    const param = {
      id: localStorage.getItem('uid'),
      where: 'sid = ' + localStorage.getItem('uid')
    };
    this.dummy = Array(10);
    this.api.post('rating/getFromIDs', param).subscribe((data: any) => {
      this.dummy = [];
      if (data && data.status === 200) {
        this.reviews = data.data;
      }
      if(event != null) {
        event.target.complete();
      }
    }, error => {
      this.dummy = [];
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
      if(event != null) {
        event.target.complete();
      }
    });
  }

  back() {
    this.navCtrl.back();
  }

  getDate(date) {
    return moment(date).format('lll');
  }
}
