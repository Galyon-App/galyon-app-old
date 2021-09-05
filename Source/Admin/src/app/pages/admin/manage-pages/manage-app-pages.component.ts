/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { ToastyService, ToastData, ToastOptions } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ApisService } from 'src/app/services/apis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-manage-app-pages',
  templateUrl: './manage-app-pages.component.html',
  styleUrls: ['./manage-app-pages.component.css']
})
export class ManageAppPagesComponent {

  name: any = '';
  content: any = '';
  id: any = '';
  ckeditorContent: any = '';

  constructor(
    public api: ApisService,
    private util: UtilService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.ukey) {
        this.id = data.ukey;
        this.getPageById();
      } else {
        this.navCtrl.back();
      }
    });
  }

  getPageById() {
    this.spinner.show();
    this.api.post('galyon/v1/pages/getPageByID', {
      ukey: this.id
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        const info = response.data;
        this.name = info.name;
        this.content = info.content;
      } else {
        this.navCtrl.back();
        this.util.error(response.message);
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.util.error('Something went wrong');
    }).catch((error) => {
      console.log(error);
      this.spinner.hide();
      this.util.error('Something went wrong');
    });
  }

  submit() {
    if (!this.name || !this.content) {
      this.util.error(this.api.translate('All Fields are required'));
      return false;
    }

    this.spinner.show();
    this.api.post('galyon/v1/pages/editPageCurrent', {
      ukey: this.id,
      name: this.name,
      content: this.content
    }).then((response) => {
      if(response && response.success) {
        this.spinner.hide();
        this.navCtrl.back();
      } else {
        this.util.error(response.message);
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  onChange(event) {
  }

  onEditorChange(event) {
  }
}
