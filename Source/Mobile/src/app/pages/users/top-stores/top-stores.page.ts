/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { CityService } from 'src/app/services/city.service';
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
    private router: Router,
    private city: CityService
  ) {
    this.haveSearch = false;
    this.getStoreFeatured(null);
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
        id: item.uid
      }
    };
    this.router.navigate(['user/home/store'], param);
  }


  getTime(time) {
    // const date = moment().format('DD-MM-YYYY');
    // return moment(date + ' ' + time).format('hh:mm a');
    return moment(time, ['h:mm A']).format('hh:mm A');
  }

  getStoreFeatured(event) {
    this.api.post('galyon/v1/stores/getStoreFeatured', {
      city_id: this.city.activeCity,
      limit_start: this.limit_start,
      limit_length: this.limit_length
    }).subscribe((response: any) => {
      this.dummy = [];
      if (response && response.success && response.data) {
        if(this.stores) {
          response.data.forEach(async (element) => {
            element['isOpen'] = await this.isOpen(element.open_time, element.close_time);
            this.stores.push(element);
          });
        } else {
          this.stores = response.data;
        }
        this.dummyStores = this.stores;
      }
      if(event) {
        event.complete();
      }
    }, error => {
      if(event) {
        event.complete();
      }
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

  limit_start: number = 0;
  limit_length: number = 10;
  total_length: number;

  loadData(event) {
    this.limit_start += this.limit_length;
    this.getStoreFeatured(event.target);
  }

  back() {
    this.navCtrl.back();
  }
}
