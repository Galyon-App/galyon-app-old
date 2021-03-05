/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { ApisService } from 'src/app/services/apis.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  title: any;
  descriptions: any;
  constructor(
    public api: ApisService,
    private toastyService: ToastyService,
    private router: Router
  ) {
    const param = {
      id: localStorage.getItem('uid')
    }
    this.api.auth(param).then((data) => {
      console.log('auth data->>', data);
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
  }

  ngOnInit() {
  }
  send() {
    if (!this.title || !this.descriptions) {
      this.error(this.api.translate('All Fields are required'));
      return false;
    }
    this.api.sendNotification(this.descriptions, this.title).subscribe((data) => {
      console.log(data);
      this.title = '';
      this.descriptions = '';
      this.success(this.api.translate('Notications sent'));
    }, error => {
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
}
