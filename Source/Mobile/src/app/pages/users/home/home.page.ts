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
import { Console } from 'console';
import { StoreService } from 'src/app/services/store.service';
import { OptionService } from 'src/app/services/option.service';

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

  dummyFeaturedStores: any[] = [];
  featuredStores: any[] = [];

  dummyStores: any[] = [];
  stores: any[] = [];

  terms: any;

  parentCategories: any[] = [];
  currentCity: any = '';

  haveStores: boolean;
  
  constructor(
    public util: UtilService,
    private router: Router,
    public api: ApiService,
    public cart: CartService,
    public city: CityService,
    private chMod: ChangeDetectorRef,
    private iab: InAppBrowser,
    private alertCtrl: AlertController,
    private storeServ: StoreService,
    private optServ: OptionService
  ) {
    this.dummyCates = Array(6);
    this.dummyBanners = Array(5);
    this.bottomDummy = Array(5);
    this.betweenDummy = Array(5);
    this.dummyTopProducts = Array(5);
    this.dummyProducts = Array(5);
    this.dummyStores = Array(5);
    this.dummyFeaturedStores = Array(3);

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
      this.getFeaturedProducts();
      this.getPopup();
      this.getStoreByCityAndFeatured();
      this.getStoreByCity();
    }
  }

  getStoreByCityAndFeatured() {
    this.api.post('galyon/v1/stores/getStoreFeatured', {
      city_id: this.city.activeCity
    }).subscribe((response: any) => {
      if (response && response.success && response.data) {
        this.featuredStores = response.data;
        this.dummyFeaturedStores = [];

        this.featuredStores.forEach(async (store) => {
          store['isOpen'] = await this.isOpen(store.open_time, store.close_time);
        });
      } else {
        this.resetAllArrays(response.message);
      }
    }, error => {
      this.resetAllArrays('Something went wrong');
    });
  }

  async getPopup() {
    const alertCtrl = await this.alertCtrl.create({
      header: this.util.getString('Message'),
      message: 'Welcome to our application!',
      mode: 'ios',
      buttons: [this.util.getString('Cancle'), this.util.getString('Ok')],
    });
  }

  resetAllArrays(message) {
    // this.haveStores = true; //TEMP
    // this.stores = [];
    // this.parentCategories = [];
    // this.categories = [];
    // this.banners = [];
    // this.bottomBanners = [];
    // this.betweenBanners = [];
    // this.topProducts = [];
    // this.products = [];
    // if(message != null) {
    //   this.chMod.detectChanges();
    //   this.util.errorToast(message);
    // }
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
    this.api.post('galyon/v1/stores/getAllStores', {
      uuid: this.city.activeCity
    }).subscribe((response: any) => {
      if (response && response.success && response.data) {
        this.stores = response.data;
        this.dummyStores = [];

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

  getFeaturedProducts() {
    this.dummyTopProducts = Array(5);

    this.api.get('galyon/v1/products/getFeaturedProduct').subscribe((response: any) => {
      if (response && response.success && response.data) {
        response.data.forEach(element => {
          if (element.variations && element.variations !== '' && element.variations.length > 0) {
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.variations)) {
              element.variations = JSON.parse(element.variations);
              element.variations.forEach(element => {
                element.current = 0;
              });
            } else {
              element.variations = [];
            }
          } else {
            element.variations = [];
          }
          if (this.cart.checkProductInCart(element.uuid)) {
            let filterprod: any = this.cart.cart.filter(x => x.uuid === element.uuid);
            element['quantiy'] = filterprod[0].quantiy;
            element.variations.forEach(variant => {
              let cartVariant: any = filterprod[0].variations.filter( x => x.title == variant.title);
              if(cartVariant.length) {
                variant.current = cartVariant[0].current;
              }
            });
          } else {
            element['quantiy'] = 0;
          }
          this.topProducts.push(element);
          // if (this.util.active_store.includes(element.store_id)) {
          //   this.topProducts.push(element);
          // }
        });
        this.dummyTopProducts = [];
      }
    }, error => {
      console.log(error);
    });

  }

  async variant(item, var_id) {
    const allData = [];
    if (item && item.variations !== '' && item.variations.length > 0 && item.variations[var_id]) {
      let variant = item.variations[var_id];
      variant.items.forEach((element, index) => {
        let title = '';
        let discount_type = variant.items[index].discount_type;
        let discount_amt = variant.items[index].discount;
        let discount_sfx = discount_type == 'percent' ? '%' : ' off';
        let discount_text = discount_type != 'none' ? ' ('+discount_amt+discount_sfx+')' : '';
        if(discount_type == 'none' || discount_amt == '0' || discount_amt == 0) {
          discount_text = '';
        }
        const price = variant.items[index] && variant.items[index].discount ? variant.items[index].discount : variant.items[index].price;
        if (this.util.cside === 'left') {
          title = ' * ' +element.title + ' : +' + this.util.currecny + '' + price + discount_text;
        } else {
          title = ' * ' +element.title + ' : +' + price + '' + this.util.currecny + discount_text;
        }

        const data = {
          name: element.title,
          type: 'radio',
          label: title,
          value: index,
          checked: variant.current === index
        };
        allData.push(data);
      });      

      const alert = await this.alertCtrl.create({
        header: item.name + ': ' + variant.title,
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
            text: this.util.getString('Confirm'),
            handler: (data) => {
              console.log('Confirm Ok', data);
              let prod_index = this.topProducts.indexOf(item);
              this.topProducts[prod_index].variations[var_id].current = data;
          
              let cartProduct: any = this.cart.cart.filter( x => x.uuid == item.uuid);
              if(cartProduct.length) {
                cartProduct[0].variations[var_id].current = data;
              }
              this.cart.saveLocalToStorage();
            }
          }
        ]
      });
      await alert.present();
    } else {
      console.log('none');
    }
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
    this.topProducts[index].quantiy = 1;
    this.cart.addItem(item);
  }

  getQuanity(id) {
    const data = this.cart.cart.filter(x => x.uuid === id);
    return data[0].quantiy;
  }

  openMenu() {
    this.util.openMenu();
  }

  add(product, index) {
    this.topProducts[index].quantiy = this.getQuanity(product.uuid);
    if (this.topProducts[index].quantiy > 0) {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy + 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.uuid);
    }
  }

  remove(product, index) {
    this.topProducts[index].quantiy = this.getQuanity(product.uuid);
    if (this.topProducts[index].quantiy === 1) {
      this.topProducts[index].quantiy = 0;
      this.cart.removeItem(product.uuid)
    } else {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy - 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.uuid);
    }
  }

  goToSingleProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        uuid: item.uuid
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
    if (item.type === '0') {
      // Category
      console.log('open category');
      const name = this.categories.filter(x => x.uuid === item.uuid);
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
        uuid: val.uuid,
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
    const param: NavigationExtras = {
      queryParams: {
        uuid: item.uuid
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
    if (event && event !== '') {
      const param = {
        id: this.city.current.uuid,
        search: event
      };
      this.util.show();
      this.api.post('products/getSearchItems', param).subscribe((data: any) => {
        this.util.hide();
        if (data && data.status === 200 && data.data) {
          this.products = data.data;
        }
      }, error => {
        this.util.hide();
        this.util.errorToast(this.util.getString('Something went wrong'));
      });
    }
  }
}
