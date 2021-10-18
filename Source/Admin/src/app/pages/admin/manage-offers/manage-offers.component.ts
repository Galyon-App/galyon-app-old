import { ActivatedRoute, Router } from '@angular/router';
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ApisService } from 'src/app/services/apis.service';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';

@Component({
  selector: 'app-manage-offers',
  templateUrl: './manage-offers.component.html',
  styleUrls: ['./manage-offers.component.scss']
})
export class ManageOffersComponent {

  id: any = '';
  name: any;
  off: any;
  type: any = 'fixed';
  min: any;
  expired_at: any;
  descriptions: any = '';
  coverImage: any;
  upto: any;
  status: any;

  constructor(
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private util: UtilService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data.uuid) {
        this.id = data.uuid;
        this.getOfferById();
      }
    });
  }

  getOfferById() {
    this.spinner.show();
    this.api.post('galyon/v1/offers/getOfferByID', {
      "uuid": this.id
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        const info = response.data;
        this.coverImage = info.image;
        this.name = info.name;
        this.off = info.off;
        this.type = info.type;
        this.min = info.min;
        this.expired_at = this.getDate(info.expired_at);
        this.descriptions = info.descriptions;
        this.upto = info.upto;
      } else {
        this.util.error(this.api.translate('Something went wrong'));
      }
    }).catch((error) => {
      console.log(error);
      this.spinner.hide();
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  getDate(item) {
    return moment(item).format('lll');
  }

  manage() {
    if(this.id) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    if (!this.name || this.name === '' || !this.off || this.off === '' || !this.type || this.type === '' || !this.min || this.min === '' || !this.expired_at || this.expired_at === '' || !this.upto || this.upto === '') {
      this.util.error('All Fields are required');
      return false;
    }

    if (this.coverImage === '' || !this.coverImage) {
      this.util.error(this.api.translate('Please add image'));
      return false;
    }

    this.spinner.show();
    this.api.post('galyon/v1/offers/createNewOffer', {
      name: this.name,
      off: this.off,
      type: this.type,
      min: this.min,
      upto: this.upto,
      expired_at: this.expired_at,
      image: this.coverImage,
      descriptions: this.descriptions,
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.navCtrl.back();
      } else {
        this.util.error('Something went wrong');
      }
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.util.error('Something went wrong');
    });
  }

  update() {
    if (!this.id || this.id === '' || !this.name || this.name === '' || !this.off || this.off === '' || !this.type || this.type === '' || !this.min || this.min === '' || !this.expired_at || this.expired_at === '' || !this.upto || this.upto === '') {
      this.util.error('All Fields are required');
      return false;
    }

    if (this.coverImage === '' || !this.coverImage) {
      this.util.error(this.api.translate('Please add image'));
      return false;
    }

    this.spinner.show();
    this.api.post('galyon/v1/offers/editOfferCurrent', {
      uuid: this.id,
      name: this.name,
      off: this.off,
      type: this.type,
      min: this.min,
      upto: this.upto,
      expired_at: this.expired_at,
      image: this.coverImage,
      descriptions: this.descriptions,
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.navCtrl.back();
      } else {
        this.util.error('Something went wrong');
      }
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.util.error('Something went wrong');
    });
  }

  preview_banner(files) {
    console.log('file-info', files);
    // this.banner_to_upload = [];
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // this.banner_to_upload = files;
    if (files) {
      this.spinner.show();
      this.api.uploadFile(files).subscribe((response: any) => {
        this.spinner.hide();
        if (response && response.success && response.data) {
          this.coverImage = response.data;
        }
      }, err => {
        console.log(err);
        this.spinner.hide();
      });
    } else {
      console.log('no');
    }
  }
}
