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
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  active_val = 'Home';
  qty = 1;


  cities: any[] = [];
  categories: any[] = [];
  seletectCities: any = '';

  terms: any = '';
  products: any[] = [];
  constructor(
    private router: Router,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService
  ) {
    this.getCities();
    this.getCategories();
  }

  ngOnInit(): void {
  }

  getCities() {
    this.api.get('cities').then((data) => {
      console.log(data);
      if (data && data.status === 200 && data.data.length) {
        this.cities = data.data.filter(x => x.status === '1');;
        console.log('active cities', this.cities);
        const selected = this.cities.filter(x => x.id === localStorage.getItem('city'));
        if (selected && selected.length > 0) {
          this.seletectCities = selected[0].name;
        }
      }
    }, error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch((error) => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    })
  }

  openCategory(item) {
    console.log(item);
  }

  getCategories() {
    this.api.get('categories').then((data) => {
      console.log(data);
      if (data && data.status === 200 && data.data.length) {
        this.categories = data.data.filter(x => x.status === '1');
      }
    }, error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch((error) => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  selectedCity(item) {
    console.log(item);
    localStorage.setItem('city', item.id);
    window.location.reload();
  }

  search(event) {
    console.log(event);
    if (this.terms && this.terms !== '') {
      const param = {
        id: localStorage.getItem('city'),
        search: this.terms
      };
      this.util.start();
      this.api.post('products/getSearchItems', param).then((data: any) => {
        console.log('search data==>', data);
        this.util.stop();
        if (data && data.status === 200 && data.data) {
          this.products = data.data.filter(x => x.status === '1');
        }
      }, error => {
        console.log('error in searhc filess--->>', error);
        this.util.stop();
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }).catch((error) => {
        console.log('error in searhc filess--->>', error);
        this.util.stop();
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
    }
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToAccount() {
    this.router.navigate(['/account']);
  }


  goToHome(val) {
    this.active_val = val;
    this.router.navigate(['/home']);
  }

  minus() {
    if (this.qty > 1) {
      this.qty = this.qty - 1;
    }
  }

  plus() {
    this.qty = this.qty + 1;
  }

}
