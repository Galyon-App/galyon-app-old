/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-manage-banners',
  templateUrl: './manage-banners.component.html',
  styleUrls: ['./manage-banners.component.scss']
})
export class ManageBannersComponent {

  position: any;
  type: any;
  coverImage: any;
  link: any;
  search: any;
  cate: any[] = [];
  dummyCate: any[] = [];
  products: any[] = [];
  dummyProducts: any[] = [];
  banner_to_upload: any = '';
  edit: boolean;
  message: any;
  id: any;

  constructor(
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private navCtrl: Location,
    private util: UtilService,
    private router: Router
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data.uuid) {
        this.id = data.uuid;
        this.edit = true;
        this.getById();
      } else {
        this.edit = false;
        this.getDatas();
      }
    });
  }

  getById() {
    this.spinner.show();
    this.api.post('galyon/v1/banners/getBannerByID', {
      "uuid": this.id
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        const info = response.data;
        this.coverImage = info.cover;
        this.position = info.position;
        this.type = info.type;
        this.message = info.message;
        this.link = info.link;
        this.getDatas();
      } else {
        this.util.error(this.api.translate('Something went wrong'));
      }
    }).catch((error) => {
      console.log(error);
      this.spinner.hide();
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  getDatas() {
    // this.api.get('products').then((data: any) => {
    //   console.log('products', data);
    //   this.dummyProducts = [];
    //   if (data && data.status === 200 && data.data && data.data.length > 0) {
    //     this.dummyProducts = data.data;
    //     if (this.id && this.type === '1') {
    //       const name = this.dummyProducts.filter(x => x.id === this.link);
    //       console.log('nama,maa==>>>', name);
    //       if (name && name.length) {
    //         this.search = name[0].name;
    //       }
    //     }
    //   }
    // }).catch(error => {
    //   console.log(error);
    // });

    // this.api.get('categories').then((datas: any) => {
    //   console.log(datas);
    //   this.dummyCate = [];
    //   if (datas && datas.data && datas.data.length) {
    //     this.dummyCate = datas.data;
    //     if (this.id && this.type === '0') {
    //       const name = this.dummyCate.filter(x => x.id === this.link);
    //       console.log('nama,maa==>>>', name);
    //       if (name && name.length) {
    //         this.search = name[0].name;
    //       }
    //     }
    //   }
    // }, error => {
    //   console.log(error);
    //   this.util.error(this.api.translate('Something went wrong'));
    // }).catch(error => {
    //   console.log(error);
    //   this.util.error(this.api.translate('Something went wrong'));
    // });
  }

  searchCate(str) {
    if (str && str !== '') {
      // this.cate = this.dummyCate.filter(x => x.name === str);
      this.cate = this.dummyCate.filter((item) => {
        return item.name.toLowerCase().indexOf(str.toLowerCase()) > -1;
      });
    } else {
      this.cate = [];
    }
  }

  selectCate(item) {
    this.link = item.id;
    this.search = item.name;
    this.cate = [];
  }

  selectProduct(item) {
    this.link = item.id;
    this.search = item.name;
    this.products = [];
  }

  changeType() {
    this.search = '';
    this.link = '';
  }

  searchProduct(str) {
    console.log(str);
    if (str && str !== '') {
      this.products = this.dummyProducts.filter((item) => {
        return item.name.toLowerCase().indexOf(str.toLowerCase()) > -1;
      });
    } else {
      this.products = [];
    }
  }

  preview_banner(files) {
    console.log('file-info', files);
    this.banner_to_upload = [];
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    this.banner_to_upload = files;
    if (this.banner_to_upload) {
      this.spinner.show();
      this.api.uploadFile(this.banner_to_upload).subscribe((data: any) => {
        this.spinner.hide();
        if (data && data.status === 200 && data.data) {
          this.coverImage = data.data;
        }
      }, err => {
        console.log(err);
        this.spinner.hide();
      });
    } else {
      console.log('no');
    }
  }

  create() {
    if (!this.position || this.position === '' || !this.type || this.type === '' || !this.link || this.link === '' ) {
      this.util.error('All Fields are required');
      return false;
    }

    if (this.coverImage === '' || !this.coverImage) {
      this.util.error(this.api.translate('Please add image'));
      return false;
    }

    this.spinner.show();
    this.api.post('galyon/v1/banners/createNewBanner', {
      cover: this.coverImage,
      position: this.position,
      link: this.link,
      type: this.type,
      message: this.message
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data ) {
        this.api.alerts(this.api.translate('Success'), this.api.translate('Banner Added'), 'success');
        this.navCtrl.back();
      } else {
        this.util.error(this.api.translate('Something went wrong'));
      }

    }, error => {
      this.spinner.hide();
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  update() {
    if (!this.position || this.position === '' || !this.type || this.type === '' || !this.link || this.link === '' ) {
      this.util.error('All Fields are required');
      return false;
    }

    if (this.coverImage === '' || !this.coverImage) {
      this.util.error(this.api.translate('Please add image'));
      return false;
    }

    this.spinner.show();
    this.api.post('galyon/v1/banners/editBannerCurrent', {
      uuid: this.id,
      cover: this.coverImage,
      position: this.position,
      link: this.link,
      type: this.type,
      message: this.message,
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.api.alerts(this.api.translate('Success'), this.api.translate('Updated!'), 'success');
        this.navCtrl.back();
      } else {
        this.util.error(response.message);
      }
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.util.error(this.api.translate('Something went wrong2'));
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.util.error(this.api.translate('Something went wrong3'));
    });
  }
}
