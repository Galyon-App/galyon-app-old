/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-app-pages',
  templateUrl: './app-pages.component.html',
  styleUrls: ['./app-pages.component.css']
})
export class AppPagesComponent {

  dummy = Array(5);
  list: any[] = [];
  dummyList: any[] = [];
  page = 1;

  constructor(
    private router: Router,
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private util: UtilService,
  ) {
    this.getAllPages();
  }

  getAllPages() {
    this.api.post('galyon/v1/pages/getAllPages', {
      limit_start: 0,
      limit_length: 1000
    }).then((response: any) => {
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
        this.api.post('galyon/v1/pages/'+actions, {
          ukey: item.ukey
        }).then((response) => {
          if(response.success) {
            let index = this.list.findIndex((x => x.ukey == item.ukey));
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

  getClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round btn-outline_success';
    } else {
      return 'btn btn-danger btn-round btn-outline-danger';
    }
  }

  view(item) {
    const param: NavigationExtras = {
      queryParams: {
        ukey: item.ukey
      }
    };
    this.router.navigate(['admin/manage-pages'], param);
  }
}
