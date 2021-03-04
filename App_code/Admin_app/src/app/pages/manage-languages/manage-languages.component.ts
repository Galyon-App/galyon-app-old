import { ActivatedRoute, Router } from '@angular/router';
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
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ApisService } from 'src/app/services/apis.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-languages',
  templateUrl: './manage-languages.component.html',
  styleUrls: ['./manage-languages.component.css']
})
export class ManageLanguagesComponent implements OnInit {
  name: any = '';
  status: any = 'active';
  banner_to_upload: any = '';
  jsonFile: any = '';
  jsonObject: any = '';
  jsonURL: any = '';
  coverImage: any = '';
  fileURL: any = '';
  edit: boolean;
  id: any;
  position: any = 1;
  constructor(
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private route: ActivatedRoute,
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
    this.route.queryParams.subscribe((data) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.edit = true;
        this.getById();
      } else {
        this.edit = false;
      }
    });
  }

  getById() {
    const param = {
      id: this.id
    };
    this.spinner.show();
    this.api.post('lang/getById', param).then((datas: any) => {
      this.spinner.hide();
      console.log('response', datas);
      if (datas && datas.data && datas.data.length) {
        const info = datas.data[0];
        this.fileURL = info.cover;
        this.name = info.name;
        this.id = info.id;
        this.coverImage = environment.mediaURL + info.cover;
        this.position = info.positions;
        this.jsonURL = info.file;
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

  ngOnInit() {
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
      this.api.uploadFile(this.banner_to_upload).subscribe((data: any) => {
        console.log('==>>', data);
        this.spinner.hide();
        if (data && data.status === 200 && data.data) {
          this.fileURL = data.data;
          this.coverImage = environment.mediaURL + data.data;
        }
      }, err => {
        console.log(err);
        this.spinner.hide();
      });
    } else {
      console.log('no');
    }
  }

  preview_banner2(files) {

    console.log('fle', files);
    this.jsonFile = [];
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType !== 'application/json') {
      this.error('Please upload valid json file');
      return;
    }
    console.log('upload new');
    this.jsonFile = files;
    if (this.jsonFile) {
      console.log('ok');
      this.spinner.show();
      this.api.uploadFile(this.jsonFile).subscribe((data: any) => {
        console.log('==>>', data);
        this.spinner.hide();
        if (data && data.status === 200 && data.data) {
          this.jsonURL = data.data;
          this.jsonObject = environment.mediaURL + data.data;
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
    if (this.coverImage === '' || !this.coverImage) {
      this.error(this.api.translate('Please add image'));
      return false;
    }
    if (this.jsonURL === '' || !this.jsonURL) {
      this.error('Please add file');
      return false;
    }
    this.spinner.show();
    const param = {
      cover: this.fileURL,
      status: 1,
      name: this.name,
      file: this.jsonURL,
      is_default: 0,
      positions: this.position,
    };
    console.log('ok', param);
    this.spinner.show();
    this.api.post('lang/save', param).then(data => {
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
      this.error('Please add name');
      return false;
    }
    if (this.coverImage === '' || !this.coverImage) {
      this.error(this.api.translate('Please add image'));
      return false;
    }
    if (this.jsonURL === '' || !this.jsonURL) {
      this.error('Please add file');
      return false;
    }
    this.spinner.show();
    const param = {
      cover: this.fileURL,
      name: this.name,
      id: this.id,
      file: this.jsonURL,
      positions: this.position
    };
    console.log('ok', param);
    this.spinner.show();
    this.api.post('lang/editList', param).then(data => {
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
