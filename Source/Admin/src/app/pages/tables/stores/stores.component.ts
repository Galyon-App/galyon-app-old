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
import * as moment from 'moment';
import { UtilService } from 'src/app/services/util.service';
import { StoresService } from 'src/app/services/stores.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private util: UtilService,
    private storeServ: StoresService
  ) {
    this.getAllStores(null);
  }

  getAllStores(search) {
    this.storeServ.searchStore({
      search: search ? this.searchText : "",
      owner: this.auth.userValue.uuid ? this.auth.userValue.uuid : "",
    }, (stores) => {
      if(stores) {
        this.dummy = [];
        this.stores = stores;
        this.dummyStores = stores;
      }
    });
  }

  search() {
    this.getAllStores(this.searchText);
  }

  filter(string) {
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

      let has_name: boolean = item.name ? item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 : false;
      let has_address: boolean = item.address ? item.address.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 : false;
      let has_city: boolean = item.city_name ? item.city_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 : false;
      let has_owner: boolean = item.owner_name ? item.owner_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 : false;

      if(has_name || has_address || has_city || has_owner) {
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
    this.router.navigate([this.getRolePath()+'/manage-stores'], navData);
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
            this.util.success(null);
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
    this.router.navigate([this.getRolePath()+'/manage-stores'], navData);
  }

  getCurrency() {
    return this.api.getCurrecySymbol();
  }

  getTime(time) {
    return moment('2020-12-05 ' + time).format('hh:mm a');
  }

  getRolePath() {
    return this.auth.userValue.role == "store" ? "merchant":this.auth.userValue.role;;
  }
}
