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
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-manage-app-pages',
  templateUrl: './manage-app-pages.component.html',
  styleUrls: ['./manage-app-pages.component.css']
})
export class ManageAppPagesComponent implements OnInit {
  name: any = '';
  content: any = '';
  id: any = '';
  ckeditorContent: any = '';
  constructor(
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private route: ActivatedRoute,
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
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.id) {
        this.id = data.id;
        this.getById();
      } else {
        this.navCtrl.back();
      }
    });
  }

  ngOnInit(): void {
  }

  getById() {
    const param = {
      id: this.id
    };
    this.spinner.show();
    this.api.post('pages/getById', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200 && data.data) {
        const info = data.data[0];
        this.name = info.name;
        this.content = info.content;
      } else {
        this.navCtrl.back();
        this.error('Something went wrong');
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error('Something went wrong');
    }).catch((error) => {
      console.log(error);
      this.spinner.hide();
      this.error('Something went wrong');
    });
  }

  submit() {
    console.log('send');
    if (!this.name || !this.content) {
      this.error(this.api.translate('All Fields are required'));
      return false;
    }
    const param = {
      id: this.id,
      name: this.name,
      content: this.content
    };
    console.log(param);
    console.log('send mail');
    this.spinner.show();
    this.api.post('pages/editList', param).then((data) => {
      console.log(data);
      this.spinner.hide();
      this.success('mail sent');
      this.name = '';
      this.content = '';
      this.navCtrl.back();
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


  onChange(event) {
  }

  onEditorChange(event) {
  }
}
