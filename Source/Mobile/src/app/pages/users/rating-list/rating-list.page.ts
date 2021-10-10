/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute } from '@angular/router';
import { ProductRatingPage } from '../product-rating/product-rating.page';
import { StoreRatingPage } from '../store-rating/store-rating.page';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-rating-list',
  templateUrl: './rating-list.page.html',
  styleUrls: ['./rating-list.page.scss'],
})
export class RatingListPage implements OnInit {

  id: any;
  name: any;
  type: any;
  dummy: any[] = new Array(4);
  ratings: any[] = [];

  rate: any = 2;
  comment: any = '';

  total: any;
  way: any;

  userHasReview: boolean = false;

  constructor(
    private authServ: AuthService,
    public api: ApiService,
    public util: UtilService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.uuid) {
        this.id = data.uuid;
        this.name = data.name;
        this.type = data.type;
        this.getFrom();
      }
    })
  }

  submit() {
    this.util.show();

    this.api.post('galyon/v1/reviews/createProductReview', {
      uid: this.authServ.userToken,
      pid: this.id,
      rate: this.rate,
      msg: this.comment,
      way: 'direct',
    }).subscribe((response: any) => {
      this.util.hide();
      console.log(response);

      if (response && response.success && response.data) {
        this.util.showToast('Rating added', 'success', 'bottom');
        this.userHasReview = true;
        this.comment = '';

        this.ratings.push(response.data);
        let count = 0;
        const sum = this.ratings.reduce((sum, item, index) => {
          item = parseFloat(item);
          count += item;
          return sum + item * (index + 1);
        }, 0);
        const storeRating = (sum / count).toFixed(2);    
      } else {
        this.util.errorToast(this.util.getString('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  onRatingChange(event) {
    console.log(event);
  }

  getFrom() {
    //TODO: getFromIDs depending on request.
    const query = this.type === 'product' ? 'pid = ' + this.id : 'sid = ' + this.id
    this.ratings = [];

    this.api.post('galyon/v1/reviews/getByPid', {
      uuid: this.id,
      limit_length: 100
    }).subscribe((response: any) => {
      this.dummy = [];
      if (response && response.success && response.data) {
        this.ratings = response.data;

        let userReviews: any[] = this.ratings.filter(x => x.uid == this.authServ.userToken.uuid);
        this.userHasReview = userReviews.length>0 ? true:false;

        this.ratings = this.ratings.filter(x => x.uid != this.authServ.userToken.uuid);
        if(this.userHasReview) {
          this.ratings.unshift(userReviews[0]);
        }
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  ngOnInit() {
  }

  back() {
    this.modalCtrl.dismiss();
  }

  async addNew() {
    const modal = await this.modalCtrl.create({
      component: this.type === 'product' ? ProductRatingPage : StoreRatingPage,
      cssClass: 'modalContact',
      backdropDismiss: false,
      swipeToClose: true,
      componentProps: {
        id: this.id,
        name: this.name,
        way: 'direct'
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data.role);
      if (data && data.role === 'success') {
        this.getFrom();
      }
    })
    return await modal.present();
  }

  getDate(date) {
    return moment(date).format('ll');
  }
}
