/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products: any[] = [];
  dummy = Array(20);
  dummyProducts: any[] = [];
  constructor(
    private navCtrl: NavController,
    private router: Router,
    public api: ApiService,
    public util: UtilService
  ) {
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  ngOnInit() {
  }

  getProducts() {
    const param = {
      id: localStorage.getItem('uid'),
      limit: 5000,
    };
    this.api.post('products/getByStoreId', param).subscribe((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200) {
        this.products = data.data;
        this.dummyProducts = data.data;
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
      this.dummy = [];
    });
  }

  back() {
    this.navCtrl.back();
  }


  onSearchChange(event) {
    console.log(event.detail.value);
    this.products = this.dummyProducts.filter((ele: any) => {
      return ele.name.toLowerCase().includes(event.detail.value.toLowerCase());
    });
  }

  viewProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['tabs/tab3/new-product'], param);
  }

  createNew() {
    console.log('createnew');
    this.router.navigate(['tabs/tab3/new-product']);
  }
}
