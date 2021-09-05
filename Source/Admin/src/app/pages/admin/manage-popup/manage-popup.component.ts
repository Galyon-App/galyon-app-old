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
  selector: 'app-manage-popup',
  templateUrl: './manage-popup.component.html',
  styleUrls: ['./manage-popup.component.css']
})
export class ManagePopupComponent {

  name: any;
  status: any;
  haveSave: boolean;
  id: any;

  constructor(
    public api: ApisService,
    private util: UtilService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private router: Router
  ) {
    this.getPrimaryPopup();
  }

  getPrimaryPopup() {
    this.spinner.show();
    this.api.post('galyon/v1/popups/getMostRecent', {}).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        const info = response.data[0]; //TEMP
        this.id = info.uuid;
        this.name = info.message;
        this.status = info.status;
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
    if (!this.id || this.id === '' || !this.name || this.name === '' || this.status === '') {
      this.util.error('All Fields are required');
      return false;
    }

    this.spinner.show();
    this.api.post('galyon/v1/popups/editPopupCurrent', {
      uuid: this.id,
      message: this.name,
      status: this.status,
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.util.error('Updated successfully!');
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
