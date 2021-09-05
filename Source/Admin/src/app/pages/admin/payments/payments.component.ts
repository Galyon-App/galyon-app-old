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
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent {

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
    this.getAllPaymentMethod();
  }

  getAllPaymentMethod() {
    this.spinner.show();
    this.api.get('galyon/v1/settings/getPaymentMethods').then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.dummy = [];
        this.dummyList = response.data;
        this.list = response.data;
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

  getClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round btn-outline_success';
    } else {
      return 'btn btn-danger btn-round btn-outline-danger';
    }
  }

  /**
   * Change the status of the user to activate or deactivate.
   * @param item 
   */
  changeStatus(item) {
    const actions = item.status === '1' ? 'deactivate' : 'activate';

    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate('To ') + actions + this.api.translate(' this payment method!'),
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
        this.api.post('galyon/v1/settings/updatePayMethod/'+actions, {
          code: item.code,
          status: item.status === '1' ? '0' : '1'
        }).then((response) => {
          if(response.success) {
            let index = this.list.findIndex((x => x.code == item.code));
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

  view(item) {
    const param: NavigationExtras = {
      queryParams: {
        code: item.code
      }
    };
    this.router.navigate(['admin/manage-payment'], param);
  }
}
