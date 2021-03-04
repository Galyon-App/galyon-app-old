/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ApisService } from 'src/app/services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationExtras } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import * as _ from 'lodash';
@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.css']
})
export class LanguagesComponent implements OnInit {

  languages: any;
  dummy = Array(5);
  dummyLangs: any[] = [];
  page: number = 1;
  constructor(
    private router: Router,
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
  ) {
    const param = {
      id: localStorage.getItem('uid')
    }
    this.api.auth(param).then((data) => {
      if (data !== true) {
        localStorage.removeItem('uid');
        this.router.navigate(['login']);
      }
    }, error => {
      console.log(error);
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    }).catch((error) => {
      console.log(error);
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    });
    this.getLanguges();
  }

  ngOnInit(): void {
  }

  getLanguges() {
    this.languages = [];
    this.dummy = Array(10);
    this.api.get('lang').then((datas: any) => {
      console.log(datas);
      this.dummy = [];
      if (datas && datas.data.length) {
        this.languages = datas.data;
        this.languages = _.sortBy(this.languages, ['id'], ['asc']);
        this.dummyLangs = this.languages;
      }
    }, error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
      this.dummy = [];
    }).catch(error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }

  search(str) {
    this.resetChanges();
    console.log('string', str);
    this.languages = this.filterItems(str);
  }


  protected resetChanges = () => {
    this.languages = this.dummyLangs;
  }

  setFilteredItems() {
    console.log('clear');
    this.languages = [];
    this.languages = this.dummyLangs;
  }

  filterItems(searchTerm) {
    return this.languages.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

  changeDefault(event, item) {
    console.log(event, item);
    this.spinner.show();
    const param = {
      id: item.id,
      is_default: 1
    };
    this.api.post('lang/changeDefault', param).then((datas) => {
      this.spinner.hide();
      this.getLanguges();
    }, error => {
      this.spinner.hide();
      this.error(this.api.translate('Something went wrong'));
      console.log(error);
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }


  error(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Error'),
      msg: this.api.translate(message),
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }

  success(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Success'),
      msg: this.api.translate(message),
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }

  getClass(item) {
    if (item === '1') {
      return 'btn btn-primary btn-round';
    } else if (item === '0') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  createNew() {
    this.router.navigate(['manage-languages']);
  }
  changeStatus(item) {
    const text = item.status === '1' ? 'deactive' : 'active';
    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate('To ') + text + this.api.translate(' this category!'),
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: this.api.translate('Yes'),
      showCancelButton: true,
      cancelButtonText: this.api.translate('Cancle'),
      backdrop: false,
      background: 'white'
    }).then((data) => {
      if (data && data.value) {
        console.log('update it');
        const query = item.status === '1' ? '0' : '1';
        const param = {
          id: item.id,
          status: query
        };
        this.spinner.show();
        this.api.post('lang/editList', param).then((datas) => {
          this.spinner.hide();
          this.getLanguges();
        }, error => {
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
          console.log(error);
        }).catch(error => {
          this.spinner.hide();
          console.log(error);
          this.error(this.api.translate('Something went wrong'));
        });
      }
    });
  }

  view(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id,
        edit: true
      }
    };
    this.router.navigate(['manage-languages'], param);
  }
}
