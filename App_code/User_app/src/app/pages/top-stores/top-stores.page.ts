/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
@Component({
  selector: 'app-top-stores',
  templateUrl: './top-stores.page.html',
  styleUrls: ['./top-stores.page.scss'],
})
export class TopStoresPage implements OnInit {
  dummy = Array(10);
  dummyStores: any[] = [];
  stores: any[] = [];
  haveSearch: boolean;
  constructor(
    private navCtrl: NavController,
    public api: ApiService,
    public util: UtilService,
    private router: Router
  ) {
    this.haveSearch = false;
    this.getStores();
  }

  ngOnInit() {
  }

  search() {
    this.haveSearch = !this.haveSearch;
  }

  onSearchChange(event) {
    if (event.detail.value) {
      this.stores = this.dummyStores.filter((item) => {
        return item.name.toLowerCase().indexOf(event.detail.value.toLowerCase()) > -1;
      });
    } else {
      this.stores = this.dummyStores;
    }
  }

  openStore(item) {
    console.log('open store', item);

    const param: NavigationExtras = {
      queryParams: {
        id: item.uid,
        name: item.name
      }
    };
    this.router.navigate(['tabs/home/store'], param);
  }


  getTime(time) {
    // const date = moment().format('DD-MM-YYYY');
    // return moment(date + ' ' + time).format('hh:mm a');
    return moment(time, ['h:mm A']).format('hh:mm A');
  }

  getStores() {
    const param = {
      id: localStorage.getItem('city')
    }
    this.api.post('stores/getByCity', param).subscribe((stores: any) => {
      console.log('stores by city', stores);
      this.stores = [];
      this.dummy = [];
      if (stores && stores.status === 200 && stores.data && stores.data.length) {
        this.stores = stores.data;
        this.dummy = [];
        this.stores.forEach(async (element) => {
          element['isOpen'] = await this.isOpen(element.open_time, element.close_time);
        });
        this.dummyStores = this.stores;
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
      this.dummy = [];
      this.dummyStores = [];
      this.stores = [];
    });
  }

  isOpen(start, end) {
    const format = 'H:mm:ss';
    const ctime = moment().format('HH:mm:ss');
    const time = moment(ctime, format);
    const beforeTime = moment(start, format);
    const afterTime = moment(end, format);

    if (time.isBetween(beforeTime, afterTime)) {
      return true;
    }
    return false
  }

  back() {
    this.navCtrl.back();
  }
}
