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
import { NavController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute } from '@angular/router';
import { ProductRatingPage } from '../product-rating/product-rating.page';
import { StoreRatingPage } from '../store-rating/store-rating.page';
import * as moment from 'moment';
@Component({
  selector: 'app-rating-list',
  templateUrl: './rating-list.page.html',
  styleUrls: ['./rating-list.page.scss'],
})
export class RatingListPage implements OnInit {
  name: any;
  type: any;
  id: any;
  dummy: any[] = [];
  ratings: any[] = [];
  constructor(
    private navCtrl: NavController,
    public api: ApiService,
    public util: UtilService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.getFrom();
      }
    })
  }

  getFrom() {
    // getFromIDs
    const query = this.type === 'product' ? 'pid = ' + this.id : 'sid = ' + this.id
    const param = {
      id: this.id,
      where: query
    };
    this.dummy = Array(10);
    this.ratings = [];
    this.api.post('rating/getFromIDs', param).subscribe((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200) {
        this.ratings = data.data;
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
    this.navCtrl.back();
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
