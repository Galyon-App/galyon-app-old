/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, MenuController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { CartService } from 'src/app/services/cart.service';
import { FiltersComponent } from 'src/app/components/filters/filters.component';
import { SortPage } from '../sort/sort.page';
import { Store } from 'src/app/models/store.model';
import { StoreService } from 'src/app/services/store.service';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {
  id: any;
  name: any;
  limit: any;
  products: any[] = [];
  dummyProduct: any[] = [];
  dummy = Array(20);
  qty = 0;

  haveSearch: boolean;
  mode: any = 'grid';
  selectedFilter: any = '';
  selectedFilterID: any;

  min: any;
  max: any;
  minValue: any;
  maxValue: any;
  isClosedFilter: boolean = true;
  discount: any;
  haveSortFilter: boolean;
  storeIsActive: boolean = false;

  store: Store;
  limit_start: number = 0;
  limit_length: number = 10;
  no_stores_follows: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private router: Router,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private storeServ: StoreService,
    private productServ: ProductsService
  ) {
    this.haveSearch = false;
    this.route.queryParams.subscribe((data) => {
      if (data && data.uuid) {
        this.storeServ.getById(data.uuid, (response) => {
          if(response) {
            this.store = response;
            this.name = this.store.name;
            this.limit = 1;
            this.storeIsActive = this.storeServ.isOpen(this.store.open_time, this.store.close_time);
            this.getStoreProducts(null);
          }
        });
      }
    });
  }

  sortFilter() {
    if (this.discount && this.discount !== null) {
      const products = [];
      this.dummyProduct.forEach(element => {
        if (parseFloat(element.orig_price) >= this.minValue && parseFloat(element.orig_price) <= this.maxValue &&
          parseFloat(this.discount) <= parseFloat(element.discount)) {
          products.push(element);
        }
        this.products = products;
      });
    } else {
      const products = [];
      this.dummyProduct.forEach(element => {
        if (parseFloat(element.orig_price) >= this.minValue && parseFloat(element.orig_price) <= this.maxValue) {
          products.push(element);
        }
      });
      this.products = products;
    }
  }

  ngOnInit() {
  }

  back() {
    this.navCtrl.back();
  }

  getStoreProducts(event) {
    this.productServ.request({
      store_id: this.store.uuid,
      limit_start: this.limit_start + '',
      limit_length: this.limit_length + ''
    }, (lists) => {
      if(event === null) {
        this.dummy = []; //Initial query and no product was found.
      }
      if(lists) {
        if(this.products) {
          lists.forEach(element => {
            this.products.push(element);;
          });
        } else {
          this.products = lists;
        }
        this.dummyProduct = this.products;
        
        this.products.forEach(info => {
          if (info.variations && info.variations !== '') {
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.variations)) {
              info.variations = JSON.parse(info.variations);
              info.variations.forEach(element => {
                element.current = 0;
              });
            } else {
              info.variations = [];
            }
          } else {
            info.variations = [];
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
        this.dummy = [];

        this.max = Math.max(...this.products.map(o => o.orig_price), 0);
        this.min = Math.min.apply(null, this.products.map(item => item.orig_price))

        if (this.selectedFilterID && this.selectedFilterID !== null) {
          this.updateFilter();
        }

        if (this.haveSortFilter && this.isClosedFilter === false) {
          this.sortFilter();
        }

        if(event) {
          event.complete();
        }
      } else {
        this.no_stores_follows = true;
        if(event) {
          event.complete();
        }
      }
    });
  }

  search() {
    this.haveSearch = !this.haveSearch;
  }

  onSearchChange(event) {
    if (event.detail.value) {
      this.products = this.dummyProduct.filter((item) => {
        return item.name.toLowerCase().indexOf(event.detail.value.toLowerCase()) > -1;
      });
    } else {
      this.products = this.dummyProduct;
    }
  }

  changeMode() {
    this.mode = this.mode === 'grid' ? 'list' : 'grid';
  }

  updateFilter() {
    switch (this.selectedFilterID) {
      case '1':
        console.log('its rating');
        this.selectedFilter = this.util.getString('Popularity');
        this.products = this.products.sort((a, b) =>
          parseFloat(b.total_rating) < parseFloat(a.total_rating) ? -1
            : (parseFloat(b.total_rating) > parseFloat(a.total_rating) ? 1 : 0));
        break;

      case '2':
        console.log('its low to high');
        this.selectedFilter = this.util.getString('Price L-H');
        this.products = this.products.sort((a, b) =>
          parseFloat(a.orig_price) < parseFloat(b.orig_price) ? -1
            : (parseFloat(a.orig_price) > parseFloat(b.orig_price) ? 1 : 0));
        break;

      case '3':
        console.log('its highht to low');
        this.selectedFilter = this.util.getString('Price H-L');
        this.products = this.products.sort((a, b) =>
          parseFloat(b.orig_price) < parseFloat(a.orig_price) ? -1
            : (parseFloat(b.orig_price) > parseFloat(a.orig_price) ? 1 : 0));
        break;

      case '4':
        console.log('its a - z');
        this.selectedFilter = this.util.getString('A-Z');
        this.products = this.products.sort((a, b) => {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
        break;

      case '5':
        console.log('its z - a');
        this.selectedFilter = this.util.getString('Z-A');
        this.products = this.products.sort((a, b) => {
          if (a.name > b.name) { return -1; }
          if (a.name < b.name) { return 1; }
          return 0;
        });
        break;

      case '6':
        console.log('its % off');
        this.selectedFilter = this.util.getString('% Off');
        this.products = this.products.sort((a, b) =>
          parseFloat(b.discount) < parseFloat(a.discount) ? -1
            : (parseFloat(b.discount) > parseFloat(a.discount) ? 1 : 0));
        break;

      default:
        break;
    }
  }

  async filter(events) {
    const popover = await this.popoverController.create({
      component: FiltersComponent,
      event: events,
      mode: 'ios',
    });
    popover.onDidDismiss().then(data => {
      console.log(data.data);
      if (data && data.data && data.role === 'selected') {
        this.selectedFilterID = data.data;
        this.updateFilter();
      }
    });
    await popover.present();
  }

  onChat() {
    const param: NavigationExtras = {
      queryParams: {
        uuid: this.id,
        name: this.name
      }
    };
    this.router.navigate(['user/chat'], param);
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

  checkCartItems() {
    const cart = this.cart.cart;
    if (cart && cart.length) {
      cart.forEach(element => {
        if (this.cart.cart && this.cart.cart.length && this.cart.checkProductInCart(element.uuid)) {
          const index = this.products.findIndex(x => x.uuid === element.uuid);
          this.products[index].quantiy = element.quantiy;
        }
      });
    }
  }

  addToCart(item, index) {
    console.log(item);
    this.products[index].quantiy = 1;
    this.cart.addItem(item);
  }

  checkCart(uuid) {
    this.cart.checkProductInCart(uuid);
  }

  loadData(event) {
    this.limit_start += this.limit_length;
    this.getStoreProducts(event.target);
  }

  singleProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        uuid: item.uuid
      }
    };

    this.router.navigate(['user/home/product'], param);
  }

  async priceFilter() {
    // console.log('print a filter');
    // this.util.publishFilter({ min: this.min, max: this.max, from: 'products' });
    // this.menuCtrl.enable(true, 'menu1');
    // this.menuCtrl.open('menu1').then(() => {
    //   console.log('menu 1');
    // });
    const modal = await this.modalController.create({
      component: SortPage,
      componentProps: { min: this.min, max: this.max, from: 'products', discountSelected: this.discount }
    });
    modal.onDidDismiss().then((datas: any) => {
      const data = datas.data;
      console.log(data);
      this.haveSortFilter = true;
      if (this.products && data.from === 'products') {
        this.minValue = data.min;
        this.maxValue = data.max;
        this.discount = data.discount;
        this.isClosedFilter = data.close;
        if (this.isClosedFilter === false) {
          this.sortFilter();
        } else {
          this.products = this.dummyProduct;
        }
      }
    })
    return await modal.present();
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
