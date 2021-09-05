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
import * as moment from 'moment';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-manage-app',
  templateUrl: './manage-app.component.html',
  styleUrls: ['./manage-app.component.css']
})
export class ManageAppComponent  {

  name: any;
  status: any;
  id: any;

  constructor(
    public api: ApisService,
    private util: UtilService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private router: Router
  ) {
    this.getCurrent();
  }

  getCurrent() {
    this.spinner.show();
    this.api.post('galyon/v1/settings/getMaintainanceStatus', {}).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
          const info = response.data;
          this.name = info.message;
          this.status = info.enabled;
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

  submit() {
    this.api.post('galyon/v1/settings/setMaintainanceStatus', {
      enabled: this.status,
      message: this.name
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.util.success('Updated successfully!');
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
}
