/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {

  stores: any[] = [];
  dummystores: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService,
    private router: Router
  ) {
    this.dummystores = Array(30);
    this.getStore();
  }

  ngOnInit(): void {
  }

  getStore() {
    const param = {
      id: localStorage.getItem('website-current-city')
    };
    this.api.post('stores/getByCity', param).then((stores: any) => {
      console.log('stores by city', stores);
      this.stores = [];
      this.dummystores = [];
      if (stores && stores.status === 200 && stores.data && stores.data.length) {
        this.stores = stores.data;

        this.stores.forEach(async (element) => {
          element['isOpen'] = await this.isOpen(element.open_time, element.close_time);
        });
        console.log('store====>>>', this.stores);
      }
    }, error => {
      this.dummystores = [];
      console.log(error);
      this.util.toast('error', this.util.translate('Error'), this.util.translate('Something went wrong'));
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
    return false;
  }

  openStore(item) {
    console.log('open store', item);
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['shop', item.uid, name]);
    // const param: NavigationExtras = {
    //   queryParams: {
    //     id: item.uid,
    //     name: item.name
    //   }
    // };
    // this.router.navigate(['/stores-products'], param);
  }

  getTime(time) {
    return moment(time, ['h:mm A']).format('hh:mm A');
  }

}
