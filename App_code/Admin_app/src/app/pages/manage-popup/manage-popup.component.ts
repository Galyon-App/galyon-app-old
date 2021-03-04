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
import { ToastyService, ToastData, ToastOptions } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ApisService } from 'src/app/services/apis.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-manage-popup',
  templateUrl: './manage-popup.component.html',
  styleUrls: ['./manage-popup.component.css']
})
export class ManagePopupComponent implements OnInit {
  name: any;
  status: any;
  haveSave: boolean;
  id: any;
  constructor(
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private router: Router
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
    this.getCurrennt();
  }

  ngOnInit(): void {
  }


  getCurrennt() {
    this.spinner.show();
    this.api.get('popup').then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        if (data && data.data && data.data.length) {
          this.haveSave = true;
          const info = data.data[0];
          this.id = info.id;
          this.name = info.message;
          this.status = info.shown;
        }
      } else {
        this.haveSave = false;
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
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


  submit() {

    if (this.haveSave) {
      console.log('update', this.status);
      if (this.status === 0 || this.status === '0') {
        if (this.name === '' || !this.name) {
          console.log('close but no message foud');
          this.error(this.api.translate('All Fields are required'));
          return false;
        }
      }
      const param = {
        shown: this.status,
        message: this.name,
        date_time: moment().format('YYYY-MM-DD HH:mm:SS'),
        id: this.id
      };

      console.log('param', param);
      this.spinner.show();
      this.api.post('popup/editList', param).then((data: any) => {
        console.log('data', data);
        this.spinner.hide();
        if (data && data.status === 200) {
          this.success('status updated');
          this.haveSave = true;
        } else {
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.api.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.api.translate('Something went wrong'));
      });


    } else {
      console.log('create');
      if (this.name && this.status) {
        const param = {
          shown: 1,
          message: this.name,
          date_time: moment().format('YYYY-MM-DD HH:mm:SS')
        };

        console.log('param', param);
        this.spinner.show();
        this.api.post('popup/save', param).then((data: any) => {
          console.log('data', data);
          this.spinner.hide();
          if (data && data.status === 200) {
            this.success('status updated');
            this.haveSave = true;
            this.id = data.data.id;
          } else {
            this.spinner.hide();
            this.error(this.api.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
        }).catch(error => {
          console.log(error);
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
        });
      } else {
        this.error(this.api.translate('All Fields are required'));
      }
    }

  }

}
