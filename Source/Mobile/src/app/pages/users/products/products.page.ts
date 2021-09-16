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
import { CityService } from 'src/app/services/city.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

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
  from: any;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public api: ApiService,
    public util: UtilService,
    private router: Router,
    public cart: CartService,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private city: CityService
  ) {
    this.haveSearch = false;
    this.route.queryParams.subscribe((data) => {
      if (data && data.uuid) {
        this.id = data.uuid;
        this.name = data.name;
        this.from = data.from;
        this.limit = 1;
        this.haveSortFilter = false;
        this.getProducts(false, 'none');
      }
    });
  }

  sortFilter() {
    if (this.discount && this.discount !== null) {
      console.log('filter with discount');
      const products = [];
      this.dummyProduct.forEach(element => {
        if (parseFloat(element.orig_price) >= this.minValue && parseFloat(element.orig_price) <= this.maxValue &&
          parseFloat(this.discount) <= parseFloat(element.discount)) {
          products.push(element);
        }
        this.products = products;
      });
    } else {
      console.log('filter without discount');
      const products = [];
      this.dummyProduct.forEach(element => {
        if (parseFloat(element.orig_price) >= this.minValue && parseFloat(element.orig_price) <= this.maxValue) {
          products.push(element);
        }
      });
      this.products = products;
    }
  }

  search() {
    this.haveSearch = !this.haveSearch;
  }

  onSearchChange(event) {
    console.log(event.detail.value);
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

  getProducts(limit, event) {

    const stores = {
      id: this.city.current.uuid
    };
    this.api.post('stores/getByCity', stores).subscribe((stores: any) => {
      if (stores && stores.status === 200 && stores.data && stores.data.length) {
        this.util.active_store = [...new Set(stores.data.map(item => item.uid))];
        const param = {
          uuid: this.id,
          limit: this.limit * 10,
          cid: this.city.current.uuid
        };

        this.api.post('products/getBySid', param).subscribe((data: any) => {
          console.log('ids', data);
          this.dummy = [];
          if (data && data.status === 200 && data.data && data.data.length) {
            const products = data.data;
            this.products = products.filter(x => x.status === '1' && this.util.active_store.includes(x.store_id));
            this.dummyProduct = this.products;
            // const cart = this.cart.cart;
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
                const index = this.cart.cart.filter(x => x.uuid === info.uuid);
                info['quantiy'] = index[0].quantiy;
              } else {
                info['quantiy'] = 0;
              }
            });

            this.max = Math.max(...this.products.map(o => o.orig_price), 0);
            console.log('maxValueOfPrice', this.max);

            this.min = Math.min.apply(null, this.products.map(item => item.orig_price))
            console.log('minValueOfPrice', this.min);
            if (this.selectedFilterID && this.selectedFilterID !== null) {
              this.updateFilter();
            }
            if (this.haveSortFilter && this.isClosedFilter === false) {
              this.sortFilter();
            }

          }
          if (limit) {
            event.complete();
          }

        }, error => {
          console.log(error);
          this.util.errorToast(this.util.getString('Something went wrong'));
          if (limit) {
            event.complete();
          }
        });
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
      if (limit) {
        event.complete();
      }
    });

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
    return this.cart.checkProductInCart(uuid);
  }

  ngOnInit() {
  }

  back() {
    this.navCtrl.back();
  }

  loadData(event) {
    console.log(event);
    this.limit = this.limit + 1;
    this.getProducts(true, event.target);
  }

  singleProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        uuid: item.uuid
      }
    };
    if (this.from === 'home') {
      this.router.navigate(['/home/product'], param);
    } else {
      this.router.navigate(['/categories/product'], param);
    }

  }

  async priceFilter() {
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
