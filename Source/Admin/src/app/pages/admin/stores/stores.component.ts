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
import * as moment from 'moment';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent {

  searchText: any = '';
  stores: any[] = [];
  dummyStores: any[] = [];
  dummy = Array(5);
  page: number = 1;

  constructor(
    public api: ApisService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private util: UtilService,
    private toastyService: ToastyService,
  ) {
    this.getAllStores();
  }

  getAllStores() {
    this.api.post('galyon/v1/stores/getAllStores', {}).then((response: any) => {
      if (response && response.success && response.data) {
        this.dummy = [];
        this.stores = response.data;
        this.dummyStores = response.data;
      }
    }, error => {
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  search(string) {
    this.resetChanges();
    this.stores = this.filterItems(string);
  }

  protected resetChanges = () => {
    this.stores = this.dummyStores;
  }

  setFilteredItems() {
    this.stores = [];
    this.stores = this.dummyStores;
  }

  filterItems(searchTerm) {
    return this.stores.filter((item) => {
      if(item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || 
        item.address.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
        return true;
      }
      return false;
    });

  }

  getClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round btn-outline_success';
    } else {
      return 'btn btn-danger btn-round btn-outline-danger';
    }
  }

  openRest(item) {
    const navData: NavigationExtras = {
      queryParams: {
        uuid: item.uuid,
        register: false
      }
    };
    this.router.navigate(['admin/manage-stores'], navData);
  }

  /**
   * Change the status of the user to activate or deactivate.
   * @param item 
   */
   changeStatus(item) {
    const actions = item.status === '1' ? 'deactivate' : 'activate';

    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate('To ') + actions + this.api.translate(' this store!'),
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
        this.api.post('galyon/v1/stores/'+actions, {
          uuid: item.uuid
        }).then((response) => {
          if(response.success) {
            let index = this.stores.findIndex((x => x.uuid == item.uuid));
            this.stores[index].status = response.data.status;
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

  createNew() {
    const navData: NavigationExtras = {
      queryParams: {
        register: true
      }
    };
    this.router.navigate(['admin/manage-stores'], navData);
  }

  getCurrency() {
    return this.api.getCurrecySymbol();
  }

  getTime(time) {
    return moment('2020-12-05 ' + time).format('hh:mm a');
  }
}

