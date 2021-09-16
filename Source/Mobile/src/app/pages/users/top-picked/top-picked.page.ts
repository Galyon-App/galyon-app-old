/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { CartService } from 'src/app/services/cart.service';
import { FiltersComponent } from 'src/app/components/filters/filters.component';
import { SortPage } from '../sort/sort.page';
import { CityService } from 'src/app/services/city.service';
import { ProductsService } from 'src/app/services/products.service';
@Component({
  selector: 'app-top-picked',
  templateUrl: './top-picked.page.html',
  styleUrls: ['./top-picked.page.scss'],
})
export class TopPickedPage implements OnInit {

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
  constructor(
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private navCtrl: NavController,
    private router: Router,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private city: CityService,
    private productServ: ProductsService
  ) {
    this.getFeaturedProducts(null);
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

  ngOnInit() {
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

  getFeaturedProducts(event) {

    this.api.post('galyon/v1/products/getFeaturedProduct', {
      limit_start: this.limit_start,
      limit_length: this.limit_length
    }).subscribe((response: any) => {
      if (response && response.success && response.data) {
        response.data.forEach(element => {
          if (element.status === '0') {
            console.log(element);
            return;
          }

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
            const index = this.cart.cart.filter(x => x.uuid === element.uuid);
            element['quantiy'] = index[0].quantiy;
          } else {
            element['quantiy'] = 0;
          }
          this.products.push(element);
          this.dummyProduct.push(element);
          // if (this.util.active_store.includes(element.store_id)) {
          //   this.topProducts.push(element);
          // }
        });
        this.dummy = [];
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

  back() {
    this.navCtrl.back();
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

  singleProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.uuid
      }
    };

    this.router.navigate(['user/categories/product'], param);
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

  limit_start: number = 0;
  limit_length: number = 10;
  total_length: number;
  no_stores_follows: boolean = false;

  loadData(event) {
    this.limit_start += this.limit_length;
    this.getFeaturedProducts(event.target);
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
