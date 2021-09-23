/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { Router, NavigationExtras, Route, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import * as moment from 'moment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController, NavController } from '@ionic/angular';
import { CityService } from 'src/app/services/city.service';
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
    slidesPerView: 1.7,
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

  dummyFeaturedStores: any[] = [];
  featuredStores: any[] = [];

  dummyStores: any[] = [];
  stores: any[] = [];

  terms: any;

  haveStores: boolean = false;
  
  constructor(
    public util: UtilService,
    private router: Router,
    private route: ActivatedRoute,
    public api: ApiService,
    public cart: CartService,
    private chMod: ChangeDetectorRef,
    private iab: InAppBrowser,
    private alertCtrl: AlertController,
    public city: CityService,
    private storeServ: StoreService,
    public navCtrl: NavController,
    private optServ: OptionService
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data && data.action) {
        if(data.action == "refresh") {
          this.initHome("refresh");
        }
      } else {
        this.initHome();
      }
    });
    
  }

  initHome(event = null) {
    this.limit_start = 0;
    this.terms = '';

    this.dummyCates = Array(6);
    this.dummyBanners = Array(5);
    this.betweenDummy = Array(5);
    this.dummyTopProducts = Array(5);
    this.dummyFeaturedStores = Array(3);
    this.bottomDummy = Array(5);
    this.dummyStores = Array(5);

    if (!this.util.appClosed) {
      this.resetAllArrays(null);
      this.getAllCategories();
      this.getBanners();
      this.getFeaturedProducts();
      this.getPopup();
      this.getStoreByCityAndFeatured();
      this.getStoreByCity(event);
    }
  }

  getStoreByCityAndFeatured() {
    this.api.post('galyon/v1/stores/getStoreFeatured', {
      //city_id: this.city.activeCity,
      limit_start: 0,
      limit_length: 5
    }).subscribe((response: any) => {
      if (response && response.success && response.data) {
        this.featuredStores = response.data;
        this.dummyFeaturedStores = [];

        this.featuredStores.forEach(async (store) => {
          store['isOpen'] = await this.isOpen(store.open_time, store.close_time);
        });
      }
    }, error => {
      console.log(error);
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
    this.products = [];
    this.categories = [];
    this.banners = [];
    this.topProducts = [];
    this.betweenBanners = [];
    this.featuredStores = [];
    this.bottomBanners = [];
    this.stores = [];

    if(message != null) {
      this.chMod.detectChanges();
      this.util.errorToast(message);
    }
  }

  limit_start: number = 0;
  limit_length: number = 5;
  total_length: number;
  no_stores_follows: boolean = false;

  loadData(event) {
    this.limit_start += this.limit_length;
    this.getStoreByCity(event.target);
  }

  getStoreByCity(event) {
    this.api.post('galyon/v1/stores/getAllStores', {
      city_id: this.city.activeCity,
      limit_start: this.limit_start,
      limit_length: this.limit_length
    }).subscribe((response: any) => {
      if (response && response.success && response.data) {
        
        let new_store: any[] = [];
        new_store = response.data;

        if(this.stores.length > 0) {
          new_store.forEach(element => {
            this.stores.push(element);;
          });
        } else {
          this.stores = new_store;
          this.dummyStores = [];
          this.haveStores = true;
        }

        this.stores.forEach(async (store) => {
          store['isOpen'] = await this.isOpen(store.open_time, store.close_time);
          if(!store.address) {
            store.address = "Not yet set...";
          }
        });
        this.util.active_store = [...new Set(this.stores.map(item => item.uuid))];
      } else {
        if(event == "refresh") {
          this.haveStores = false;
        }
        this.no_stores_follows = true;
      }

      if(event && typeof event.complete == 'function') {
        event.complete();
      }
    }, error => {
      if(event && typeof event.complete == 'function') {
        event.complete();
      }
      this.resetAllArrays('Something went wrong');
    });
  }

  getAllCategories() { 
    this.api.get('galyon/v1/category/getParentCategorys').subscribe((response: any) => {
      if (response && response.success && response.data) {
        response.data.forEach(element => {
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
        if(this.banners.length > 0) {
          this.dummyBanners = [];
        }
        if(this.bottomBanners.length > 0) {
          this.bottomDummy = [];
        }
        if(this.betweenBanners.length > 0) {
          this.betweenDummy = [];
        }
      }
    }, error => {
      console.log(error);
    });
  }

  getFeaturedProducts() {
    this.api.post('galyon/v1/products/getFeaturedProduct', {
      limit_start: 0,
      limit_length: 10
    }).subscribe((response: any) => {
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
            element['quantity'] = filterprod[0].quantity;
            element.variations.forEach(variant => {
              let cartVariant: any = filterprod[0].variations.filter( x => x.title == variant.title);
              if(cartVariant.length) {
                variant.current = cartVariant[0].current;
              }
            });
          } else {
            element['quantity'] = 0;
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

        const price = parseFloat(variant.items[index].price);
        const discount = parseFloat(variant.items[index].discount);
        const discounted = price - (price*(discount/100));
        const sub_price = discount > 0 ? discounted.toFixed(2) : price.toFixed(2);
        const price_text = parseFloat(sub_price) == 0 ? "FREE" : 
          this.util.cside === 'left' ? this.util.currecny+sub_price : sub_price+this.util.currecny;
        const discount_text = discount > 0 ? " ("+discount+"%)" : "";
        let title = ' * ' +element.title + ' : ' + price_text + discount_text;

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
        header: 'Choose ' + variant.title,
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
    return moment(time, ['h:mm A']).format('hh:mm A');
  }

  addToCart(item, index) {
    this.topProducts[index].quantity = 1;
    this.cart.addItem(item);
  }

  getQuanity(id) {
    const data = this.cart.cart.filter(x => x.uuid === id);
    return data[0].quantity;
  }

  openMenu() {
    this.util.openMenu();
  }

  add(product, index) {
    this.topProducts[index].quantity = this.getQuanity(product.uuid);
    if (this.topProducts[index].quantity > 0) {
      this.topProducts[index].quantity = this.topProducts[index].quantity + 1;
      this.cart.addQuantity(this.topProducts[index].quantity, product.uuid);
    }
  }

  remove(product, index) {
    this.topProducts[index].quantity = this.getQuanity(product.uuid);
    if (this.topProducts[index].quantity === 1) {
      this.topProducts[index].quantity = 0;
      this.cart.removeItem(product.uuid)
    } else {
      this.topProducts[index].quantity = this.topProducts[index].quantity - 1;
      this.cart.addQuantity(this.topProducts[index].quantity, product.uuid);
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
    // if (event.detail.value) {
    // } else {
    //   this.products = [];
    // }
    this.search(this.terms);
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
    this.products = [];
    if (event && event !== '') {
      this.api.post('galyon/v1/stores/getAllStores', {
        filter_term: event,
        limit_start: 0,
        limit_length: 10
      }).subscribe((response: any) => {
        if (response && response.success && response.data) {
          this.products = response.data;
        }
      }, error => {
        console.log(error);
      });
    }
  }

  homeRefresh(event) {
    event.target.complete();
    this.initHome();
  }

  ionViewDidLoad() {
    console.log("I'm alive!");
  }

  ionViewWillLeave() {
    console.log("Looks like I'm about to leave :(");
  }
}
