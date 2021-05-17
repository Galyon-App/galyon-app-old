/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-all-offers',
  templateUrl: './all-offers.page.html',
  styleUrls: ['./all-offers.page.scss'],
})
export class AllOffersPage implements OnInit {
  dummy = Array(10);
  list: any[] = [];
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router,
    private navCtrl: NavController,
    private iab: InAppBrowser
  ) {
    this.getOffers();
  }

  getOffers() {
    this.api.get('banners').subscribe((data: any) => {
      this.dummy = [];
      this.list = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        data.data.forEach(element => {
          if (element && element.status === '1') {
            this.list.push(element);
          }
        });
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
      this.dummy = [];
      this.list = [];
    });
  }

  ngOnInit() {
  }

  openLink(item) {
    if (item.type === '0') {
      console.log('open category');
      const param: NavigationExtras = {
        queryParams: {
          id: item.link,
          name: 'Category'
        }
      };
      this.router.navigate(['home/sub-category'], param);
    } else if (item.type === '1') {
      // product
      console.log('open product');
      const param: NavigationExtras = {
        queryParams: {
          id: item.link
        }
      };

      this.router.navigate(['categories/product'], param);
    } else {
      // link
      // console.log('open link');
      this.iab.create(item.link, '_blank');
    }
  }

  back() {
    this.navCtrl.back();
  }

}
