/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ApisService } from 'src/app/services/apis.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-sub-category',
  templateUrl: './manage-sub-category.component.html',
  styleUrls: ['./manage-sub-category.component.css']
})
export class ManageSubCategoryComponent {

  cateId: any;
  id: any;
  name: any;
  coverImage: any;
  banner_to_upload: any = '';
  fileURL: any = '';
  edit: boolean;
  categories: any[] = [];

  constructor(
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data && data.uuid) {
        this.id = data.uuid;
        this.edit = true;
        this.getById();
      } else {
        this.edit = false;
      }
    });
    this.getCategory();
  }

  getCategory() {
    this.categories = [];
    this.api.get('categories').then((datas: any) => {
      console.log(datas);

      if (datas && datas.data.length) {
        this.categories = datas.data;
      }
    }, error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }

  getById() {
    const param = {
      id: this.id
    };
    this.spinner.show();
    this.api.post('subcate/getById', param).then((datas: any) => {
      this.spinner.hide();
      console.log('response', datas);
      if (datas && datas.data && datas.data.length) {
        const info = datas.data[0];
        this.fileURL = info.cover;
        this.name = info.name;
        this.id = info.id;
        this.cateId = info.cate_id;
        this.coverImage = environment.mediaURL + info.cover;
      }
    }, error => {
      this.spinner.hide();
      console.log('errror', error);
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
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

  preview_banner(files) {

    console.log('fle', files);
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
      console.log('ok');
      this.spinner.show();
      this.api.uploadFile(this.banner_to_upload).subscribe((response: any) => {
        this.spinner.hide();
        if (response && response.success && response.data) {
          this.fileURL = response.data;
          this.coverImage = environment.mediaURL + response.data;
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

    if (!this.name || this.name === '') {
      this.error('Please add name');
      return false;
    }
    if (!this.cateId || this.cateId === '') {
      this.error('Please select category');
      return false;
    }
    if (this.coverImage === '' || !this.coverImage) {
      this.error(this.api.translate('Please add image'));
      return false;
    }
    this.spinner.show();
    const param = {
      cover: this.fileURL,
      status: 1,
      name: this.name,
      cate_id: this.cateId
    };
    console.log('ok', param);
    this.spinner.show();
    this.api.post('subcate/save', param).then(data => {
      this.spinner.hide();
      console.log(data);
      this.api.alerts(this.api.translate('Success'), this.api.translate('Category added'), 'success');
      this.navCtrl.back();
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }

  update() {

    if (!this.name || this.name === '') {
      this.error('Please select name');
      return false;
    }
    if (!this.cateId || this.cateId === '') {
      this.error('Please select category');
      return false;
    }
    if (this.coverImage === '' || !this.coverImage) {
      this.error(this.api.translate('Please add image'));
      return false;
    }
    this.spinner.show();
    const param = {
      cover: this.fileURL,
      name: this.name,
      id: this.id,
      cate_id: this.cateId
    };
    console.log('ok', param);
    this.spinner.show();
    this.api.post('subcate/editList', param).then(data => {
      this.spinner.hide();
      console.log(data);
      this.api.alerts(this.api.translate('Success'), this.api.translate('Category added'), 'success');
      this.navCtrl.back();
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }
}
