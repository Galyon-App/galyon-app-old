/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent {

  dummy = Array(5);
  list: any[] = [];
  dummyList: any[] = [];
  page = 1;

  constructor(
    private router: Router,
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private util: UtilService,
    private toastyService: ToastyService,
  ) {
    this.getAllOffers();
  }

  getAllOffers() {
    this.api.post('galyon/v1/offers/getAllOffers', {}).then((response: any) => {
      if (response && response.success && response.data) {
        this.dummy = [];
        this.list = response.data;
        this.dummyList = response.data;
      }
    }, error => {
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  createNew() {
    this.router.navigate(['admin/manage-offers']);
  }

  /**
   * Change the status of the user to activate or deactivate.
   * @param item 
   */
  open(item) {
    const actions = item.status === '1' ? 'deactivate' : 'activate';

    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate('To ') + actions + this.api.translate(' this offer!'),
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: this.api.translate('Yes'),
      showCancelButton: true,
      cancelButtonText: this.api.translate('Cancel'),
      backdrop: false,
      background: 'white'
    }).then((data) => {
      if (data && data.value) {
        this.spinner.show();
        this.api.post('galyon/v1/offers/'+actions, {
          uuid: item.uuid
        }).then((response) => {
          if(response.success) {
            let index = this.list.findIndex((x => x.uuid == item.uuid));
            this.list[index].status = response.data.status;
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
    });
  }

  search(str) {

  }

  getDate(item) {
    return moment(item).format('lll');
  }

  getClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round btn-outline_success';
    } else {
      return 'btn btn-danger btn-round btn-outline-danger';
    }
  }

  manage(item) {
    const param: NavigationExtras = {
      queryParams: {
        uuid: item.uuid
      }
    };
    this.router.navigate(['admin/manage-offers'], param);
  }
}
