/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ApisService } from 'src/app/services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationExtras } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent {

  cities: any;
  dummy = Array(5);
  dummyCities: any[] = [];
  page: number = 1;

  constructor(
    private router: Router,
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private util: UtilService,
    private toastyService: ToastyService,
  ) {
    this.getAllCities();
  }

  getAllCities() {
    this.api.post('galyon/v1/cities/getAllCities', {
      limit_start: 0,
      limit_length: 1000
    }).then((response: any) => {
      if (response && response.success && response.data) {
        this.dummy = [];
        this.cities = response.data;
        this.dummyCities = response.data;
      }
    }, error => {
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  search(str) {
    this.resetChanges();
    this.cities = this.filterItems(str);
  }

  filterItems(searchTerm) {
    return this.cities.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  protected resetChanges = () => {
    this.cities = this.dummyCities;
  }

  getClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round btn-outline_success';
    } else {
      return 'btn btn-danger btn-round btn-outline-danger';
    }
  }

  createNew() {
    this.router.navigate(['admin/manage-city']);
  }

  /**
   * Change the status of the user to activate or deactivate.
   * @param item 
   */
   changeStatus(item) {
    const actions = item.status === '1' ? 'deactivate' : 'activate';

    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate('To ') + actions + this.api.translate(' this city!'),
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
        this.api.post('galyon/v1/cities/'+actions, {
          uuid: item.uuid
        }).then((response) => {
          if(response.success) {
            let index = this.cities.findIndex((x => x.uuid == item.uuid));
            this.cities[index].status = response.data.status;
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
        uuid: item.uuid
      }
    };
    this.router.navigate(['admin/manage-city'], param);
  }
}
