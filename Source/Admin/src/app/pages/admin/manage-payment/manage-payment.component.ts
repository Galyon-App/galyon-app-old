/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { Location } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-manage-payment',
  templateUrl: './manage-payment.component.html',
  styleUrls: ['./manage-payment.component.css']
})
export class ManagePaymentComponent {

  id: any;
  name: any;
  data = {
    env: '',
    test: '',
    live: '',
    code: ''
  };

  constructor(
    private router: Router,
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    private route: ActivatedRoute,
    private navCtrl: Location,
    private util: UtilService
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data && data.code) {
        this.id = data.code;
        this.getById();
      }
    });
  }

  getById() {
    this.spinner.show();
    this.api.get('galyon/v1/settings/getTargetPaymentMethod/'+this.id).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        const info = response.data;
        const data = info.data;
        this.name = info.name;
        this.data = JSON.parse(data);
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

  update() {
    this.spinner.show();
    this.api.post('galyon/v1/settings/updatePayMethod/update', {
      code: this.id,
      data: JSON.stringify(this.data)
    }).then((response) => {
      if(response.success) {
        this.util.error( "Updated successfully!" );
      } else {
        this.util.error( response.message );
      }
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
    });
  }

}
