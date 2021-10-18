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

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.css']
})
export class ManageCategoryComponent {
  
  name: any = '';
  status: any = 'active';
  coverImage: any = '';
  fileURL: any = '';
  id: any = '';
  categories: any[] = [];
  cateId: any = null;

  constructor(
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private route: ActivatedRoute,
    private router: Router,
    private util: UtilService
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data && data.uuid) {
        this.id = data.uuid;
        this.getById();
      }
    });
    this.getCategory();
  }

  getCategory() {
    this.api.get('galyon/v1/category/getParentCategorys').then((response: any) => {
      if (response && response.success && response.data) {
        this.categories = response.data;
        this.categories.unshift({uuid: null, name: 'None'})
      }
    }, error => {
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  getById() {
    this.spinner.show();
    this.api.post('galyon/v1/category/getCategoryByID', {
      uuid: this.id
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        const info = response.data;
        this.fileURL = info.cover;
        this.name = info.name;
        this.cateId = info.parent_id ? info.parent_id : null;
        this.coverImage = environment.mediaURL + info.cover;
      }
    }, error => {
      this.spinner.hide();
      console.log('error', error);
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  preview_banner(files) {
    console.log('file-info', files);
    let banner_to_upload = [];
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    banner_to_upload = files;
    if (banner_to_upload) {
      this.spinner.show();
      this.api.uploadFile(banner_to_upload).subscribe((response: any) => {
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
    if (!this.name || this.name === '' || !this.fileURL || this.fileURL === '') {
      this.util.error('All Fields are required');
      return false;
    }

    this.spinner.show();
    this.api.post('galyon/v1/category/createNewCategory', {
      name: this.name,
      cover: this.fileURL,
      parent: this.cateId
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.util.success(null);
      } else {
        this.util.error(response.message);
      }
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.util.error('Something went wrong');
    });
  }

  update() {
    if (!this.name || this.name === '') {
      this.util.error('All Fields are required');
      return false;
    }

    this.spinner.show();
    this.api.post('galyon/v1/category/editCategoryCurrent', {
      uuid: this.id,
      name: this.name,
      cover: this.fileURL,
      parent: this.cateId
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.util.success(null);
      } else {
        this.util.error(response.message);
      }
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.util.error('Something went wrong');
    });
  }
}
