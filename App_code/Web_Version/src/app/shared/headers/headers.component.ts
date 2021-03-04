/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit {
  @ViewChild('sideMenu') public sideMenu: ModalDirective;
  active_val = 'Home';
  qty = 1;
  dummyLang: any[] = [];
  langs: any[] = [];
  selectedLanguage: any;
  test = [
    'Fresh Fruits',
    'Fresh Vegetables',
    'Exotic Fruits & Vegetables'
  ];

  terms: any = '';
  products: any[] = [];

  cities: any[] = [];
  cityName: any = '';
  dummy = Array(5);
  cityId: any;
  categories: any[] = [];
  languageClicked: boolean = false;
  constructor(
    private router: Router,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService) {
    this.router.events.subscribe(() => {
      this.products = [];
      this.terms = '';
    })
    this.dummyLang = Array(5);
    this.selectedLanguage = 'English';
    setTimeout(() => {
      this.getCities();
      this.getLangs();
      this.getCates();
    }, 1000);

  }

  getCates() {
    this.api.get('categories').then((datas: any) => {
      if (datas && datas.data && datas.data.length) {
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(this.util.header_category)) {
          const objs = JSON.parse(this.util.header_category);
          this.categories = [];
          console.log('selected?', objs);
          objs.forEach(element => {
            const obj = {
              id: element.id,
              name: element.name,
              sub: []
            };
            this.categories.push(obj);
          });
        } else {
          const list = datas.data.filter(x => x.status === '1');
          console.log('not selected');
          this.categories = [];
          list.forEach(element => {
            const obj = {
              id: element.id,
              name: element.name,
              sub: []
            };
            this.categories.push(obj);
          });
        }
        console.log('categories', this.categories);
        this.getSubCates();
      }
    }, error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    })

  }

  getSubCates() {
    this.api.get('subcate').then((datas: any) => {
      console.log(datas);
      if (datas && datas.data && datas.data.length) {
        const list = datas.data.filter(x => x.status === '1');
        this.categories.forEach((element, index) => {
          list.forEach(sub => {
            if (element.id === sub.cate_id) {
              this.categories[index].sub.push(sub);
            }
          });
        });
        console.log('all cates', this.categories);
      }
    }, error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }
  ngOnInit(): void {
  }

  getLangs() {
    this.api.get('lang').then((data: any) => {
      console.log('data--->>> languages??===??', data);
      this.dummyLang = [];
      if (data && data.status === 200 && data.data.length) {
        this.langs = data.data.filter(x => x.status === '1');
        const lng = localStorage.getItem('language');
        if (lng && lng !== null && lng !== '') {
          const selectedLang = this.langs.filter(x => x.file === lng);
          console.log('selected language', selectedLang);
          if (selectedLang && selectedLang.length) {
            this.selectedLanguage = selectedLang[0].name;
          }
        } else {
          const defaultLanguages = this.langs.filter(x => x.is_default === '1');
          if (defaultLanguages && defaultLanguages.length) {
            this.selectedLanguage = defaultLanguages[0].name;
          }
        }
      } else {
        this.selectedLanguage = 'English';
      }
    }, error => {
      this.dummyLang = [];
      console.log(';error in languge', error);
      this.selectedLanguage = 'English';
    }).catch(error => {
      this.dummyLang = [];
      console.log(';error in languge', error);
      this.selectedLanguage = 'English';
    });
  }

  changed(value) {
    const item = this.langs.filter(x => x.file === value);
    if (item && item.length > 0) {
      this.util.direction = item[0].positions === '1' ? 'ltr' : 'rtl';
      document.documentElement.dir = this.util.direction;
      localStorage.setItem('language', value);
      window.location.reload();
    }
  }

  accountAction(action) {
    if (action === 'settings') {
      const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
      this.router.navigate(['user', name, 'profile']);
    } else if (action === 'orders') {
      const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
      this.router.navigate(['user', name, 'order']);
    } else if (action === 'address') {
      const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
      this.router.navigate(['user', name, 'address']);
    } else if (action === 'help') {
      this.router.navigate(['help']);
    } else if (action === 'chats') {
      this.router.navigate(['chats']);
    } else if (action === 'faqs') {
      this.router.navigate(['faq']);
    } else {
      const city = localStorage.getItem('city');
      localStorage.clear();
      this.util.userInfo = null;
      localStorage.setItem('city', city);
      this.router.navigate(['']);
    }
  }

  getCities() {
    this.api.get('cities').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        this.cities = data.data.filter(x => x.status === '1');
        const id = localStorage.getItem('city');
        if (id && id !== null && id !== 'null') {
          this.cityId = id;
          const city = this.cities.filter(x => x.id === this.cityId);
          if (city && city.length > 0) {
            this.util.city = city[0];
            this.cityName = city[0].name;
          }
        }
      } else {
        this.util.toast('error', this.util.translate('Error'), this.util.translate('No cities found'));
      }
    }, error => {
      console.log('error', error);
      this.dummy = [];
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  haveSigned() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid !== 'null') {
      return true;
    }
    return false;
  }

  goToCart() {
    this.router.navigate(['/cart']);
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

  inputChange() {
    console.log(this.terms);
    if (this.terms) {
    } else {
      this.products = [];
    }
  }

  onHome() {
    this.router.navigate(['']);
  }

  onLogin() {
    this.util.publishModalPopup('login');
  }

  selected(item) {
    console.log('id', this.cityId);
    this.cityId = item.id;

    localStorage.setItem('city', this.cityId);
    const city = this.cities.filter(x => x.id === this.cityId);
    this.util.city = city[0];
    this.cityName = city[0].name;
    this.util.publishCity(city);
    this.cart.cart = [];
    this.cart.itemId = [];
    this.cart.totalPrice = 0;
    this.cart.grandTotal = 0;
    this.cart.coupon = null;
    this.cart.discount = null;
    this.util.clearKeys('cart');
    this.util.publishCity('data');
    this.router.navigate(['']);
  }

  onPage(item) {
    console.log(item);
    this.sideMenu.hide();
    this.router.navigate([item]);
  }

  onProfile(item) {
    this.sideMenu.hide();
    if (this.util && this.util.userInfo && this.util.userInfo.first_name) {
      const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
      this.router.navigate(['user', name, item]);
    } else {
      this.util.publishModalPopup('login');
    }
  }

  changeLanguage(value) {
    const item = this.langs.filter(x => x.file === value.file);
    if (item && item.length > 0) {
      localStorage.setItem('language', value.file);
      window.location.reload();
    }
  }

  logout() {
    this.sideMenu.hide();
    localStorage.removeItem('uid');
    this.router.navigate(['']);
  }

  search(event) {
    console.log(event);
    if (event && event !== '') {
      const param = {
        id: localStorage.getItem('city'),
        search: event
      };
      this.util.start();
      this.api.post('products/getSearchItems', param).then((data: any) => {
        console.log('search data==>', data);
        this.util.stop();
        if (data && data.status === 200 && data.data) {
          this.products = data.data;
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

  openProduct(item) {
    this.products = [];
    this.terms = '';
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
    this.router.navigate([]).then(result => { window.open('product/' + name + '/' + item.id, '_blank'); });
  }


  subItems(item, sub) {
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const sub_name = sub.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate([]).then(result => { console.log('result', result); window.open('sub/' + item.id + '/' + name + '/' + sub.id + '/' + sub_name, '_blank'); });
  }
}
