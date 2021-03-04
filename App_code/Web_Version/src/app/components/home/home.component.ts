/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { sortBy } from 'lodash';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('basicModal') public basicModal: ModalDirective;
  dummyCates = Array(30);
  categories: any[] = [];

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

  dummyStores: any[] = [];
  stores: any[] = [];

  dummyOffers: any[] = [];
  offers: any[] = [];

  bottomcategory: any[] = [];
  dummyBottomCates = Array(2);
  haveCity: boolean;

  myCarouselOptions = {
    loop: false,
    margin: 20,
    nav: true,
    dots: false,
    autoplay: true,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 3
      },
      800: {
        items: 3
      },
      1000: {
        items: 5
      }
    }
  }

  myCategoryOptions = {
    loop: false,
    margin: 20,
    nav: true,
    dots: false,
    autoplay: true,
    responsive: {
      0: {
        items: 3,
      },
      600: {
        items: 3
      },
      800: {
        items: 3
      },
      1000: {
        items: 6
      }
    }
  };

  mystoreOptions = {
    loop: false,
    margin: 20,
    nav: true,
    dots: false,
    autoplay: true,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 3
      },
      800: {
        items: 3
      },
      1000: {
        items: 6
      }
    }
  }
  constructor(
    private router: Router,
    public api: ApiService,
    public util: UtilService,
    private chMod: ChangeDetectorRef,
    public cart: CartService) {


    this.dummyCates = Array(30);
    this.dummyBanners = Array(30);
    this.bottomDummy = Array(30);
    this.betweenDummy = Array(30);
    this.dummyTopProducts = Array(30);
    this.dummyOffers = Array(30);
    this.offers = [];
    this.categories = [];
    this.banners = [];
    this.bottomBanners = [];
    this.betweenBanners = [];
    this.topProducts = [];
    this.products = [];
    this.bottomcategory = [];
    this.dummyBottomCates = Array(2);
    const city = localStorage.getItem('city');
    console.log('city', localStorage.getItem('city'));
    if (city && city != null && city !== 'null') {
      this.haveCity = true;
      this.getInit();
    } else {
      console.log('no city found...');
    }
    this.util.subscribeCity().subscribe((data: any) => {
      this.dummyCates = Array(30);
      this.dummyBanners = Array(30);
      this.bottomDummy = Array(30);
      this.betweenDummy = Array(30);
      this.dummyTopProducts = Array(30);
      this.dummyOffers = Array(30);
      this.offers = [];
      this.categories = [];
      this.stores = [];
      this.banners = [];
      this.bottomBanners = [];
      this.betweenBanners = [];
      this.topProducts = [];
      this.products = [];
      this.bottomcategory = [];
      this.dummyBottomCates = Array(2);
      this.getInit();
    });
    setTimeout(() => {
      const acceptedCookies = localStorage.getItem('acceptedCookies');
      if (acceptedCookies && acceptedCookies != null && acceptedCookies !== 'null') {
      } else {
        this.basicModal.show();
      }
    }, 1000);
  }

  getBanners() {
    this.dummyBanners = Array(30);
    this.api.get('banners').then((data: any) => {
      console.log(data);
      this.dummyBanners = [];
      this.betweenDummy = [];
      this.bottomDummy = [];
      this.bottomBanners = [];
      this.betweenBanners = [];
      this.banners = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        data.data.forEach(element => {
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

        console.log('top', this.banners);
        console.log('bottom', this.bottomBanners);
        console.log('between', this.betweenBanners);
        this.chMod.detectChanges();
        console.log('detect changes');
      }
    }, error => {
      console.log(error);
      this.dummyBanners = [];
    });
  }
  ngOnInit(): void {
  }

  getInit() {
    this.dummyCates = Array(30);
    this.dummyBanners = Array(30);
    this.bottomDummy = Array(30);
    this.betweenDummy = Array(30);
    this.dummyTopProducts = Array(30);
    this.categories = [];
    this.banners = [];
    this.bottomBanners = [];
    this.betweenBanners = [];
    this.topProducts = [];
    this.products = [];
    const param = {
      id: localStorage.getItem('city')
    };
    this.api.post('stores/getByCity', param).then((stores: any) => {
      console.log('stores by city', stores);
      this.stores = [];
      if (stores && stores.status === 200 && stores.data && stores.data.length) {
        console.log('city found');
        this.stores = stores.data;

        this.stores.forEach(async (element) => {
          element['isOpen'] = await this.isOpen(element.open_time, element.close_time);
        });
        this.util.active_store = [...new Set(this.stores.map(item => item.uid))];
        console.log('store====>>>', this.stores);
        console.log('active stores...---,<><', this.util.active_store);
        this.haveStores = true;
        this.getCategorys();
        this.getBanners();

        this.topProducts = [];
        this.dummyTopProducts = Array(30);
        this.api.post('products/getTopRated', param).then((data: any) => {
          console.log('top products', data);
          this.dummyTopProducts = [];
          if (data && data.status === 200 && data.data && data.data.length) {
            data.data.forEach(element => {
              if (element.variations && element.size === '1' && element.variations !== '') {
                if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
                  element.variations = JSON.parse(element.variations);
                  element['variant'] = 0;
                } else {
                  element.variations = [];
                  element['variant'] = 1;
                }
              } else {
                element.variations = [];
                element['variant'] = 1;
              }
              if (this.cart.itemId.includes(element.id)) {
                const index = this.cart.cart.filter(x => x.id === element.id);
                element['quantiy'] = index[0].quantiy;
              } else {
                element['quantiy'] = 0;
              }
              if (this.util.active_store.includes(element.store_id)) {
                this.topProducts.push(element);
              }
            });
            this.chMod.detectChanges();
          }
        }, error => {
          console.log(error);
          this.dummyTopProducts = [];
        }).catch(error => {
          console.log(error);
          this.dummyTopProducts = [];
        });

        this.api.post('products/getHome', param).then((data: any) => {
          console.log('home products', data);
          this.dummyTopProducts = [];
          if (data && data.status === 200 && data.data && data.data.length) {
            data.data.forEach(element => {
              if (element.variations && element.size === '1' && element.variations !== '') {
                if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
                  element.variations = JSON.parse(element.variations);
                  element['variant'] = 0;
                } else {
                  element.variations = [];
                  element['variant'] = 1;
                }
              } else {
                element.variations = [];
                element['variant'] = 1;
              }
              if (this.cart.itemId.includes(element.id)) {
                const index = this.cart.cart.filter(x => x.id === element.id);
                element['quantiy'] = index[0].quantiy;
              } else {
                element['quantiy'] = 0;
              }
              if (this.util.active_store.includes(element.store_id)) {
                this.topProducts.push(element);
              }
            });
          }

        }, error => {
          this.dummyTopProducts = [];
          console.log(error);
        }).catch(error => {
          this.dummyTopProducts = [];
          console.log(error);
        });
        console.log('top products-->>>>>>>>>>>>>>>>--->>', this.topProducts);
        this.api.post('products/inOffers', param).then((data: any) => {
          console.log('inOffersinOffers', data);
          this.dummyOffers = [];
          if (data && data.status === 200 && data.data && data.data.length) {
            // this.util.dummyProducts = data.data;

            // const topOffers = this.util.dummyProducts.filter(x => x.in_offer === '1');
            this.offers = [];
            data.data.filter(element => {
              if (element.variations && element.size === '1' && element.variations !== '') {
                if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
                  element.variations = JSON.parse(element.variations);
                  element['variant'] = 0;
                } else {
                  element.variations = [];
                  element['variant'] = 1;
                }
              } else {
                element.variations = [];
                element['variant'] = 1;
              }
              if (this.cart.itemId.includes(element.id)) {
                const index = this.cart.cart.filter(x => x.id === element.id);
                element['quantiy'] = index[0].quantiy;
              } else {
                element['quantiy'] = 0;
              }
              if (this.util.active_store.includes(element.store_id)) {
                this.offers.push(element);
              }
            });
            this.offers = sortBy(this.offers, ['discount'], ['desc']);
            console.log('----------------------------->', this.offers);

          } else {
            this.util.dummyProducts = [];
          }
        }, error => {
          console.log(error);
          this.util.dummyProducts = [];
          this.dummyOffers = [];
        }).catch((error) => {
          console.log(error);
          this.util.dummyProducts = [];
          this.dummyOffers = [];
        });
      } else {
        this.haveStores = false;
        this.stores = [];
        console.log('no city found');
        this.dummyCates = [];
        this.dummyBanners = [];
        this.bottomDummy = [];
        this.betweenDummy = [];
        this.dummyTopProducts = [];
        this.dummyProducts = [];
        this.categories = [];
        this.banners = [];
        this.bottomBanners = [];
        this.betweenBanners = [];
        this.topProducts = [];
        this.products = [];
        this.chMod.detectChanges();
      }
    }, error => {
      console.log('error in get store by city', error);
      this.stores = [];
      this.haveStores = false;
      this.dummyCates = [];
      this.dummyBanners = [];
      this.bottomDummy = [];
      this.betweenDummy = [];
      this.dummyTopProducts = [];
      this.dummyProducts = [];
      this.categories = [];
      this.banners = [];
      this.bottomBanners = [];
      this.betweenBanners = [];
      this.topProducts = [];
      this.products = [];
      this.util.errorMessage(this.util.translate('Something went wrong'));
      this.chMod.detectChanges();
    }).catch(error => {
      console.log('error in get store by city', error);
      this.stores = [];
      this.haveStores = false;
      this.dummyCates = [];
      this.dummyBanners = [];
      this.bottomDummy = [];
      this.betweenDummy = [];
      this.dummyTopProducts = [];
      this.dummyProducts = [];
      this.categories = [];
      this.banners = [];
      this.bottomBanners = [];
      this.betweenBanners = [];
      this.topProducts = [];
      this.products = [];
      this.util.errorMessage(this.util.translate('Something went wrong'));
      this.chMod.detectChanges();
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

  acceptcookies() {
    localStorage.setItem('acceptedCookies', 'true');
    this.basicModal.hide();
  }

  getCategorys() {
    this.dummyCates = Array(30);
    this.categories = [];
    this.api.get('categories').then((datas: any) => {
      console.log('categories', datas);
      this.dummyCates = [];
      const cates = [];
      if (datas && datas.data && datas.data.length) {
        datas.data.forEach(element => {
          if (element.status === '1') {
            const info = {
              id: element.id,
              name: element.name,
              cover: element.cover,
            };
            const data = {
              id: element.id,
              name: element.name,
              cover: element.cover,
              subCates: []
            };
            cates.push(data);
            this.categories.push(info);
          }
        });

        this.api.get('subcate').then((subCates: any) => {
          console.log('sub cates', subCates);
          if (subCates && subCates.status === 200 && subCates.data && subCates.data.length) {
            cates.forEach((element, i) => {
              subCates.data.forEach(sub => {
                if (sub.status === '1' && element.id === sub.cate_id) {
                  cates[i].subCates.push(sub);
                }
              });
            });
            // console.log('=>>', this.categories);
            this.dummyBottomCates = [];
            this.bottomcategory = cates;
            console.log('bottomcategory cates==========>', this.bottomcategory);
          } else {
            this.dummyBottomCates = [];
          }
        }, error => {
          console.log(error);
          this.util.errorMessage(this.util.translate('Something went wrong'));
          this.dummyBottomCates = [];
        }).catch(error => {
          console.log(error);
          this.util.errorMessage(this.util.translate('Something went wrong'));
          this.dummyBottomCates = [];
        });
      } else {
        this.dummyCates = [];
        this.dummyBottomCates = [];
      }
    }, error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
      this.dummyCates = [];
      this.dummyBottomCates = [];
    }).catch(error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
      this.dummyCates = [];
      this.dummyBottomCates = [];
    });
  }

  goToSingleProduct(product) {
    console.log('-->', product);
    const name = product.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
    this.router.navigate(['product', name, product.id]);
  }

  subItems(item, sub) {
    console.log(item, sub);
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const sub_name = sub.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['sub', item.id, name, sub.id, sub_name]);
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

  addOffersToCart(item, index) {
    console.log(item);
    this.offers[index].quantiy = 1;
    this.cart.addItem(item);
  }

  addOffers(product, index) {
    console.log(product);
    this.offers[index].quantiy = this.getQuanity(product.id);
    if (this.offers[index].quantiy > 0) {
      this.offers[index].quantiy = this.offers[index].quantiy + 1;
      this.cart.addQuantity(this.offers[index].quantiy, product.id);
    }
  }

  removeOffers(product, index) {
    console.log(product, index);
    this.offers[index].quantiy = this.getQuanity(product.id);
    if (this.offers[index].quantiy === 1) {
      this.offers[index].quantiy = 0;
      this.cart.removeItem(product.id);
    } else {
      this.offers[index].quantiy = this.offers[index].quantiy - 1;
      this.cart.addQuantity(this.offers[index].quantiy, product.id);
    }
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
      this.cart.removeItem(product.id);
    } else {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy - 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.id);
    }
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }

  goToShopDetail() {
    this.router.navigate(['/shop-detail']);
  }

  returnContent() {
    return "This website uses cookies to improve your experience. We'll assume you're ok with this,but you can opt-out if you wish.";
  }

  getTime(time) {
    return moment(time, ['h:mm A']).format('hh:mm A');
  }

  openStore(item) {
    // console.log('open store', item);

    // const param: NavigationExtras = {
    //   queryParams: {
    //     id: item.uid,
    //     name: item.name
    //   }
    // };
    // // this.router.navigate(['stores-products'], param);
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['shop', item.uid, name]);
  }

  openLink(item) {
    console.log(item);

    if (item.type === '0') {
      console.log('open category');
      const name = this.categories.filter(x => x.id === item.link);
      let cateName: any = '';
      if (name && name.length) {
        cateName = name[0].name;
      }
      const routeName = cateName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
      this.router.navigate(['categories', item.link, routeName]);
    } else if (item.type === '1') {
      console.log('open product');
      const name = item.message.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
      this.router.navigate(['product', name, item.link]);
    } else {
      console.log('open link');
      window.open(item.link, '_blank');
    }
  }

  subCate(item) {
    console.log(item);
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
    this.router.navigate(['categories', item.id, name]);
  }

  homeProducts(from) {
    this.router.navigate(['home-products', from]);
  }

  allStores() {
    this.router.navigate(['stores-near-me']);
  }
}
