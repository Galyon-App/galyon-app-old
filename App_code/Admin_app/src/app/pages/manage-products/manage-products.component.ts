import { Location } from '@angular/common';
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
import { ActivatedRoute, Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { ToastyService, ToastData, ToastOptions } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  isNew: boolean;
  cateId: any = '';
  cateName: any = '';

  subId: any = '';
  subName: any = '';

  name: any = '';
  realPrice: any;
  sellPrice: any;
  discount: any;
  description: any;
  is_single: any;
  status: boolean = true;
  coverImage: any = '';
  veg: boolean;

  image1: any;
  image2: any;
  image3: any;
  image4: any;
  image5: any;
  image6: any;

  have_gram: boolean;
  gram: any;
  have_kg: boolean;
  kg: any;
  have_pcs: boolean;
  pcs: any;
  have_liter: boolean;
  liter: any;
  have_ml: boolean;
  ml: any;
  exp_date: any;

  in_stoke: any;
  in_offer: boolean;
  key_features: any = '';
  disclaimer: any = '';
  rating: any;
  total_rating: any;
  id: any;
  images: any[] = [];
  constructor(
    public api: ApisService,
    public util: UtilService,
    public route: ActivatedRoute,
    private navCtrl: Location,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private router: Router
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
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.getProduct();
      }
    });
  }

  getProduct() {
    const param = {
      id: this.id
    };
    this.spinner.show();
    this.api.post('products/getById', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200 && data.data.length) {
        const info = data.data[0];
        console.log('product ->', info);
        this.cateId = info.cate_id;
        this.subId = info.sub_cate_id;
        this.name = info.name;
        this.description = info.descriptions;
        this.coverImage = info.cover;
        this.key_features = info.key_features;
        this.disclaimer = info.disclaimer;
        this.discount = info.discount;
        this.exp_date = info.exp_date;
        this.gram = info.gram;
        this.have_gram = info.have_gram === '1' ? true : false;
        this.kg = info.kg;
        this.have_kg = info.have_kg === '1' ? true : false;
        this.liter = info.liter;
        this.have_liter = info.have_liter === '1' ? true : false;
        this.ml = info.ml;
        this.have_ml = info.have_ml === '1' ? true : false;
        this.pcs = info.pcs;
        this.have_pcs = info.have_pcs === '1' ? true : false;
        this.in_offer = info.in_offer === '1' ? true : false;
        this.in_stoke = info.in_stoke === '1' ? true : false;
        this.is_single = info.is_single === '1' ? true : false;
        this.veg = info.kind === '1' ? true : false;
        this.realPrice = parseFloat(info.original_price);
        this.sellPrice = parseFloat(info.sell_price);
        this.status = info.status === '1' ? true : false;
        this.rating = info.rating;
        this.total_rating = info.total_rating;
        this.images.push(this.coverImage);
        if (info.images) {
          const images = JSON.parse(info.images);
          console.log('images======>>>', images);
          if (images[0]) {
            this.image1 = images[0];
            this.images.push(this.image1);
          }
          if (images[1]) {
            this.image2 = images[1];
            this.images.push(this.image2);
          }
          if (images[2]) {
            this.image3 = images[2];
            this.images.push(this.image3);
          }
          if (images[3]) {
            this.image4 = images[3];
            this.images.push(this.image4);
          }
          if (images[4]) {
            this.image5 = images[4];
            this.images.push(this.image5);
          }
          if (images[5]) {
            this.image6 = images[5];
            this.images.push(this.image5);
          }
        }
        console.log('----->>>', this.images);
      }
    }, error => {
      this.spinner.hide();
      this.error(this.api.translate('Something went wrong'));
      console.log(error);
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
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

}
