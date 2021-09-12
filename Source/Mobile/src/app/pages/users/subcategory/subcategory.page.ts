/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { AlertController, NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { CityService } from 'src/app/services/city.service';
import * as moment from 'moment';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.page.html',
  styleUrls: ['./subcategory.page.scss'],
})
export class SubcategoryPage implements OnInit {
  @ViewChild('content', { static: false }) private content: any;

  id: any;
  name: any;
  subCates: any[] = [];
  tabSelected: any;
  products: any[] = [];
  dummyProducts: any[] = [];
  allProducts: any[] = [];
  limit: any;

  stores: any[] = [];
  dummyStores: any[] = [];
  allStores: any[] = [];

  dummys = Array(10);
  dummyCates = Array(5);

  slideOpts = {
    slidesPerView: 3.5,
    coverflowEffect: {
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  };

  limit_start: number = 0;
  limit_length: number = 10;
  total_length: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public util: UtilService,
    public api: ApiService,
    private navCtrl: NavController,
    public cart: CartService,
    private alertCtrl: AlertController,
    private city: CityService
  ) {
    this.dummys = Array(20);
    this.route.queryParams.subscribe((data) => {
      console.log(data);
      if (data && data.uuid && data.name) {
        this.limit = 1;
        this.id = data.uuid;
        this.name = data.name ? data.name : 'Top Picked';
        this.getStoreByCategory(this.id, null);
      }
    });
  }

  getStoreByCategory(subCategoryId: string = '', event) {
    this.api.post('galyon/v1/stores/getStoresByCategory', {
      city_id: this.city.activeCity,
      subcategory_id: subCategoryId,
      limit_start: this.limit_start,
      limit_length: this.limit_length
    }).subscribe((response: any) => {
      if (response && response.success && response.data) {
        this.stores = response.data;
        this.dummyStores = this.stores;

        this.stores.forEach(async (store) => {
          store['isOpen'] = await this.isOpen(store.open_time, store.close_time);
        });

        //this.util.active_store = [...new Set(this.stores.map(item => item.uuid))];
        //this.haveStores = true;
        this.dummys = [];
      } else {
        //this.resetAllArrays(response.message);
        this.dummys = [];
      }
      if(event) {
        event.complete();
      }
    }, error => {
      //this.resetAllArrays('Something went wrong');
      this.dummys = [];
      if(event) {
        event.complete();
      }
    });
  }

  viewStore(curStore) {
    const param: NavigationExtras = {
      queryParams: {
        uuid: curStore.uuid
      }
    };
    this.router.navigate(['user/home/store'], param);
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

  getSubProducts(limit, event) {
    const city = {
      uuid: this.id,
      cid: this.city.current.uuid,
      sid: this.tabSelected,
      limit: this.limit * 10
    }
    console.log('parma', city);
    // this.loaded = false;
    this.api.post('products/getByCSID', city).subscribe((cates: any) => {
      if (cates && cates.status === 200 && cates.data && cates.data.length) {
        const products = cates.data;
        this.products = products.filter(x => x.status === '1' && this.util.active_store.includes(x.store_id));
        this.dummyProducts = this.products;
        this.products.forEach(info => {
          if (info.variations && info.size === '1' && info.variations !== '') {
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.variations)) {
              info.variations = JSON.parse(info.variations);
              info['variant'] = 0;
            } else {
              info.variations = [];
              info['variant'] = 1;
            }
          } else {
            info.variations = [];
            info['variant'] = 1;
          }
          if (this.cart.checkProductInCart(info.uuid)) {
            let filterprod: any = this.cart.cart.filter(x => x.uuid === info.uuid);
            info['quantiy'] = filterprod[0].quantiy;
            info.variations.forEach(variant => {
              let cartVariant: any = filterprod[0].variations.filter( x => x.title == variant.title);
              if(cartVariant.length) {
                variant.current = cartVariant[0].current;
              }
            });
          } else {
            info['quantiy'] = 0;
          }
        });
        this.dummys = [];
      } else {
        this.dummys = [];
      }
      if (limit) {
        event.complete();
      }
    }, error => {
      console.log(error);
      this.dummys = [];
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  addToCart(item, index) {
    console.log(item);
    this.products[index].quantiy = 1;
    this.cart.addItem(item);
  }


  add(product, index) {
    console.log(product);
    if (this.products[index].quantiy > 0) {
      this.products[index].quantiy = this.products[index].quantiy + 1;
      this.cart.addQuantity(this.products[index].quantiy, product.uuid);
    }
  }

  remove(product, index) {
    console.log(product, index);
    if (this.products[index].quantiy === 1) {
      this.products[index].quantiy = 0;
      this.cart.removeItem(product.uuid)
    } else {
      this.products[index].quantiy = this.products[index].quantiy - 1;
      this.cart.addQuantity(this.products[index].quantiy, product.uuid);
    }
  }
  // getByCid
  onMenuClick(cid) {

    this.tabSelected = cid;
    this.limit = 1;
    this.dummyProducts = [];
    this.allProducts = [];
    this.dummys = Array(30);
    this.getSubProducts(false, 'none');
    this.content.scrollToPoint(0, 0, 1000);
  }

  ngOnInit() {
  }

  onProductClick(item) {
    const param: NavigationExtras = {
      queryParams: {
        uuid: item.uuid
      }
    };

    this.router.navigate(['home/product'], param);
  }

  back() {
    this.navCtrl.back();
  }

  onSearchChange(event) {
    if(event.detail.value != '') {
      if (event.detail.value) {
        this.stores = this.dummyStores.filter((item) => {
          return item.name.toLowerCase().indexOf(event.detail.value.toLowerCase()) > -1;
        });
      } else {
        this.allStores = [];
      }
    } else {
      this.stores = this.dummyStores;
    }
  }

  loadData(event) {
    this.limit_start += this.limit_length;
    this.getStoreByCategory(this.tabSelected, event.target);
  }

  singleProduct(item) {
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        uuid: item.uuid
      }
    };

    this.router.navigate(['user/home/product'], param);
  }

  goToSingleProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        uuid: item.uuid
      }
    };

    this.router.navigate(['user/home/product'], param);
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
              let prod_index = this.products.indexOf(item);
              this.products[prod_index].variations[var_id].current = data;
          
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
}
