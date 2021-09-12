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
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {

  categories: any;
  dummy = Array(5);
  dummyCates: any[] = [];
  page: number = 1;

  constructor(
    private router: Router,
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private util: UtilService,
  ) {
    this.getAllCategory();
  }

  getAllCategory() {
    //deleted: true
    this.api.post('galyon/v1/category/getAllCategorys', {}).then((response: any) => {
      if (response && response.success && response.data) {
        this.dummy = [];
        this.categories = response.data;
        this.dummyCates = response.data;
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
    this.categories = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.categories = this.dummyCates;
  }

  setFilteredItems() {
    this.categories = [];
    this.categories = this.dummyCates;
  }

  filterItems(searchTerm) {
    return this.categories.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  getClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round btn-outline_success';
    } else {
      return 'btn btn-danger btn-round btn-outline-danger';
    }
  }

  createNew() {
    this.router.navigate(['admin/manage-category']);
  }
  
  /**
   * Change the status of the user to activate or deactivate.
   * @param item 
   */
  changeStatus(item) {
    const actions = item.status === '1' ? 'deactivate' : 'activate';

    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate('To ') + actions + this.api.translate(' this category!'),
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
        this.api.post('galyon/v1/category/'+actions, {
          uuid: item.uuid
        }).then((response) => {
          if(response.success) {
            let index = this.categories.findIndex(x => x.uuid == item.uuid);
            this.categories[index].status = response.data.status;
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

  view(item) {
    const param: NavigationExtras = {
      queryParams: {
        uuid: item.uuid,
      }
    };
    this.router.navigate(['admin/manage-category'], param);
  }
}
