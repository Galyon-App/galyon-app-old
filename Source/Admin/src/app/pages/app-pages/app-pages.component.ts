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

@Component({
  selector: 'app-app-pages',
  templateUrl: './app-pages.component.html',
  styleUrls: ['./app-pages.component.css']
})
export class AppPagesComponent implements OnInit {
  dummy = Array(5);
  list: any[] = [];
  dummyList: any[] = [];
  page = 1;
  constructor(
    private router: Router,
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
  ) {
    this.getList();
  }

  ngOnInit(): void {
  }

  getList() {
    // this.dummy = Array(5);
    this.api.get('pages').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        this.list = data.data;
        this.dummyList = this.list;
      }
    }).catch(error => {
      console.log(error);
      this.error('Something went wrong');
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

  open(item) {
    console.log(item);
    const text = item.status === '1' ? 'deactive' : 'active';
    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate('To ') + text + this.api.translate(' this coupon!'),
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
        const param = {
          id: item.id,
          status: item.status === '1' ? '0' : '1'
        };
        this.spinner.show();
        this.api.post('pages/editList', param).then((data) => {
          this.spinner.hide();
          this.getList();
        }, error => {
          console.log(error);
          this.spinner.hide();
          this.error('Something went wrong');
        }).catch(error => {
          this.spinner.hide();
          console.log(error);
          this.error('Something went wrong');
        });
      }
    });
  }

  view(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['manage-app-pages'], param);
  }
}
