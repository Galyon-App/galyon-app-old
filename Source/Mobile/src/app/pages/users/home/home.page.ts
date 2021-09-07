/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import * as moment from 'moment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';
import { CityService } from 'src/app/services/city.service';
import { City } from 'src/app/models/city.model';
import { Store } from 'src/app/models/store.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  slideOpts = {
    slidesPerView: 1.3,
  };
  slideTops = {
    slidesPerView: 2,
    spaceBetween: 5,
    slideShadows: true,
  }
  categories: any[] = [];
  dummyCates: any[] = [];

  dummyBanners: any[] = [];
  banners: any[] = [];

  bottomDummy: any[] = [];
  bottomBanners: any[] = [];

  betweenDummy: any[] = [];
  betweenBanners: any[] = [];

  dummyTopProducts: any[] = [];
  topProducts: any[] = [];

  products: any[] = [];
  dummyProducts: any[] = [];

  haveStores: boolean;

  dummyTopStores: any[] = [];
  dummyStores: any[] = [];
  stores: any[] = [];
  terms: any;

  parentCategories: any[] = [];
  currentCity: any = '';
  
  constructor(
    public util: UtilService,
    private router: Router,
    public api: ApiService,
    public cart: CartService,
    public city: CityService,
    private chMod: ChangeDetectorRef,
    private iab: InAppBrowser,
    private alertCtrl: AlertController
  ) {
    this.dummyCates = Array(6);
    this.dummyBanners = Array(5);
    this.bottomDummy = Array(5);
    this.betweenDummy = Array(5);
    this.dummyTopProducts = Array(5);
    this.dummyProducts = Array(5);
    this.dummyStores = Array(5);
    this.dummyTopStores = Array(5);

    if (!this.util.appClosed) {
      this.resetAllArrays(null);
      this.city.getActiveCity((returnCity: City) => {
        if(returnCity) {
          this.currentCity = returnCity.name;
          this.chMod.detectChanges();
        }
      });
      this.getAllCategories();
      this.getBanners();


      //this.getStoreByCity();
      //this.getInit();
      //
    }
  }

  resetAllArrays(message) {
    this.haveStores = true; //TEMP
    this.stores = [];
    this.parentCategories = [];
    this.categories = [];
    this.banners = [];
    this.bottomBanners = [];
    this.betweenBanners = [];
    this.topProducts = [];
    this.products = [];
    if(message != null) {
      this.chMod.detectChanges();
      this.util.errorToast(message);
    }
    //this.dummyCates = [];
    //this.dummyBanners = [];
    //this.bottomDummy = [];
    //this.betweenDummy = [];
    //this.dummyTopProducts = [];
    //this.dummyProducts = [];
    //this.dummyTopStores = [];
    //this.dummyStores = [];
  }

  getStoreByCity() {
    this.api.post('galyon/v1/stores/getStoreByCity', {
      uuid: this.city.activeCity
    }).subscribe((response: any) => {
      if (response && response.success && response.data) {
        this.stores = response.data;

        this.stores.forEach(async (store) => {
          store['isOpen'] = await this.isOpen(store.open_time, store.close_time);
        });

        this.util.active_store = [...new Set(this.stores.map(item => item.uuid))];
        this.haveStores = true;
      } else {
        this.resetAllArrays(response.message);
      }
    }, error => {
      this.resetAllArrays('Something went wrong');
    });
  }

  getAllCategories() { 
    this.api.get('galyon/v1/category/getParentCategorys').subscribe((response: any) => {
      if (response && response.success && response.data) {
        response.data.forEach(element => {
          this.parentCategories.push(element);
          if (element.status === '1') {
            this.categories.push(element);
          }
        });
        this.dummyCates = [];
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });

    // this.api.get('galyon/v1/category/getAllCategorys').subscribe((response: any) => {
    //   if (response && response.success && response.data) {

    //     let cats = this.categories;
    //     this.categories.forEach((element, i) => {
    //       let subCates = response.data;
    //       subCates.data.forEach(sub => {
    //         if (sub.status === '1' && element.uuid === sub.category_id) {
    //           this.categories[i].subCates.push(sub);
    //         }
    //       });
    //     });
    //     this.categories = cats;
    //   }
    // }, error => {
    //   console.log(error);
    //   this.util.errorToast(this.util.getString('Something went wrong'));
    // });
  }

  viewAllParentCategory() {
    this.router.navigate(['user/home/categories']);
  }

  changeCity() {
    this.router.navigate(['cities']);
  }

  getBanners() {
    this.dummyBanners = Array(5);

    this.api.get('galyon/v1/banners/getAllBanners').subscribe((response: any) => {
      if (response && response.success && response.data) {
        response.data.forEach(element => {
          if (element && element.status === '1') {
            if (element.position === '0') {
              this.banners.push(element);
            } else if (element.position === '1') {
              this.bottomBanners.push(element);
            } else {
              this.betweenBanners.push(element);
            }
          }
        });
        this.dummyBanners = [];
        this.betweenDummy = [];
        this.bottomDummy = [];
      }
    }, error => {
      console.log(error);
    });
  }









  

  getPopup() {
    this.api.get('popup').subscribe(async (data: any) => {
      console.log('popup message', data);
      if (data && data.status === 200) {
        const info = data.data[0];
        if (info && info.shown === '1') {
          const alertCtrl = await this.alertCtrl.create({
            header: this.util.getString('Message'),
            message: info.message,
            mode: 'ios',
            buttons: [this.util.getString('Cancle'), this.util.getString('Ok')],
          });
          localStorage.setItem('pop', 'true');
          alertCtrl.present();
        }
      }
    }, error => {
      console.log(error);
    });
  }
  
  getInit() {    

    // this.api.post('products/getTopRated', param).subscribe((data: any) => {
        //   console.log('top products', data);
        //   this.dummyTopProducts = [];
        //   if (data && data.status === 200 && data.data && data.data.length) {
        //     data.data.forEach(element => {
        //       if (element.variations && element.size === '1' && element.variations !== '') {
        //         if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.variations)) {
        //           element.variations = JSON.parse(element.variations);
        //           element['variant'] = 0;
        //         } else {
        //           element.variations = [];
        //           element['variant'] = 1;
        //         }
        //       } else {
        //         element.variations = [];
        //         element['variant'] = 1;
        //       }
        //       if (this.cart.itemId.includes(element.id)) {
        //         const index = this.cart.cart.filter(x => x.id === element.id);
        //         element['quantiy'] = index[0].quantiy;
        //       } else {
        //         element['quantiy'] = 0;
        //       }
        //       if (this.util.active_store.includes(element.store_id)) {
        //         this.topProducts.push(element);
        //       }

        //     });
        //   }
        // }, error => {
        //   console.log(error);
        //   this.dummyTopProducts = [];
        // });

        // this.api.post('products/getHome', param).subscribe((data: any) => {
        //   console.log('home products', data);
        //   this.dummyTopProducts = [];
        //   if (data && data.status === 200 && data.data && data.data.length) {
        //     data.data.forEach(element => {
        //       if (element.variations && element.size === '1' && element.variations !== '') {
        //         if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.variations)) {
        //           element.variations = JSON.parse(element.variations);
        //           element['variant'] = 0;
        //         } else {
        //           element.variations = [];
        //           element['variant'] = 1;
        //         }
        //       } else {
        //         element.variations = [];
        //         element['variant'] = 1;
        //       }
        //       if (this.cart.itemId.includes(element.id)) {
        //         const index = this.cart.cart.filter(x => x.id === element.id);
        //         element['quantiy'] = index[0].quantiy;
        //       } else {
        //         element['quantiy'] = 0;
        //       }
        //       if (this.util.active_store.includes(element.store_id)) {
        //         this.topProducts.push(element);
        //       }
        //     });
        //   }
        // }, error => {
        //   this.dummyTopProducts = [];
        //   console.log(error);
        // });
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

  getTime(time) {
    // const date = moment().format('DD-MM-YYYY');
    // return moment(date + ' ' + time).format('hh:mm a');
    return moment(time, ['h:mm A']).format('hh:mm A');
  }

  addToCart(item, index) {
    console.log(item);
    this.topProducts[index].quantiy = 1;
    this.cart.addItem(item);
  }

  

  getQuanity(id) {
    const data = this.cart.cart.filter(x => x.id === id);
    return data[0].quantiy;
  }

  

  openMenu() {
    this.util.openMenu();
  }

  add(product, index) {
    console.log(product);
    this.topProducts[index].quantiy = this.getQuanity(product.id);
    if (this.topProducts[index].quantiy > 0) {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy + 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.id);
    }
  }

  remove(product, index) {
    console.log(product, index);
    this.topProducts[index].quantiy = this.getQuanity(product.id);
    if (this.topProducts[index].quantiy === 1) {
      this.topProducts[index].quantiy = 0;
      this.cart.removeItem(product.id)
    } else {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy - 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.id);
    }
  }

  goToSingleProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };

    this.router.navigate(['user/home/product'], param);
  }

  viewSubCategories(item) {
    const param: NavigationExtras = {
      queryParams: {
        uuid: item.uuid,
        name: item.name
      }
    };
    this.router.navigate(['user/home/sub-category'], param);
  }

  openLink(item) {
    console.log(item);

    if (item.type === '0') {
      // Category
      console.log('open category');
      const name = this.categories.filter(x => x.id === item.link);
      let cateName: any = '';
      if (name && name.length) {
        cateName = name[0].name
      }
      const param: NavigationExtras = {
        queryParams: {
          id: item.link,
          name: cateName
        }
      };
      this.router.navigate(['user/home/sub-category'], param);
    } else if (item.type === '1') {
      // product
      console.log('open product');
      const param: NavigationExtras = {
        queryParams: {
          id: item.link
        }
      };

      this.router.navigate(['user/home/product'], param);
    } else {
      // link
      console.log('open link');
      this.iab.create(item.link, '_blank');
    }
  }

  goToProductList(val) {
    const navData: NavigationExtras = {
      queryParams: {
        id: val.id,
        name: val.name,
        from: 'home'
      }
    }
    this.router.navigate(['user/home/products'], navData);
  }

  onSearchChange(event) {
    if (event.detail.value) {
    } else {
      this.products = [];
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
    this.router.navigate(['user/home/store'], param);
  }

  topicked() {
    this.router.navigate(['user/home/top-picked']);
  }

  topStores() {
    this.router.navigate(['user/home/top-stores']);
  }

  allOffers() {
    this.router.navigate(['user/home/all-offers']);
  }

  search(event: string) {
    console.log(event);
    if (event && event !== '') {
      const param = {
        id: localStorage.getItem('mobile-current-city'),
        search: event
      };
      this.util.show();
      this.api.post('products/getSearchItems', param).subscribe((data: any) => {
        console.log('search data==>', data);
        this.util.hide();
        if (data && data.status === 200 && data.data) {
          this.products = data.data;
        }
      }, error => {
        console.log('error in searhc filess--->>', error);
        this.util.hide();
        this.util.errorToast(this.util.getString('Something went wrong'));
      });
    }
  }

  async variant(item, indeX) {
    console.log(item);
    const allData = [];
    console.log(item && item.variations !== '');
    console.log(item && item.variations !== '' && item.variations.length > 0);
    console.log(item && item.variations !== '' && item.variations.length > 0 && item.variations[0].items.length > 0);
    if (item && item.variations !== '' && item.variations.length > 0 && item.variations[0].items.length > 0) {
      console.log('->', item.variations[0].items);
      item.variations[0].items.forEach((element, index) => {
        console.log('OK');
        let title = '';
        if (this.util.cside === 'left') {
          const price = item.variations && item.variations[0] &&
            item.variations[0].items[index] &&
            item.variations[0].items[index].discount ? item.variations[0].items[index].discount :
            item.variations[0].items[index].price;
          title = element.title + ' - ' + this.util.currecny + ' ' + price;
        } else {
          const price = item.variations && item.variations[0] && item.variations[0].items[index] &&
            item.variations[0].items[index].discount ? item.variations[0].items[index].discount :
            item.variations[0].items[index].price;
          title = element.title + ' - ' + price + ' ' + this.util.currecny;
        }
        const data = {
          name: element.title,
          type: 'radio',
          label: title,
          value: index,
          checked: item.variant === index
        };
        allData.push(data);
      });

      console.log('All Data', allData);
      const alert = await this.alertCtrl.create({
        header: item.name,
        inputs: allData,
        buttons: [
          {
            text: this.util.getString('Cancel'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: this.util.getString('Ok'),
            handler: (data) => {
              console.log('Confirm Ok', data);
              console.log('before', this.topProducts[indeX].variant);
              this.topProducts[indeX].variant = data;
              console.log('after', this.topProducts[indeX].variant);
            }
          }
        ]
      });

      await alert.present();
    } else {
      console.log('none');
    }

  }

}
