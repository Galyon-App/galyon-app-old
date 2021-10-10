/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { CartService } from 'src/app/services/cart.service';
import { CityService } from 'src/app/services/city.service';
import { Product } from 'src/app/models/product.model';
import { RatingListPage } from '../rating-list/rating-list.page';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  loaded: boolean;
  name: any = '';
  realPrice: any;
  sellPrice: any;
  discount: any;
  description: any;
  is_single: any;
  subId: any;
  status: any;
  coverImage: any = '';

  have_gram: any;
  gram: any;
  have_kg: any;
  kg: any;
  have_pcs: any;
  pcs: any;
  have_liter: any;
  liter: any;
  have_ml: any;
  ml: any;

  in_stock: any;
  in_offer: any;
  key_features: any = '';
  disclaimer: any = '';

  id: any;
  rate: any;
  gallery: any[] = [];
  slideOpts = {
    slidesPerView: 1,
  };

  slideOpts1 = {
    slidesPerView: 2.5,
  };
  related: any[] = [];
  quantity: any = 0;
  totalRating: any = 0;
  storeId: any;
  storeName: any;
  variations: any;
  storeIsActive: boolean = false;

  public product: Product;

  constructor(
    public api: ApiService,
    public util: UtilService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    public cart: CartService,
    private modalController: ModalController,
    private alertCtrl: AlertController,
  ) {
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.uuid) {
        this.loaded = false;
        this.id = data.uuid;
        this.getProduct();
      }
    })
  }

  async openViewer(url) {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src: url
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
  }

  getRelated() {
    this.api.post('galyon/v1/products/getProductsByStore', {
      uuid: this.product.store_id,
      limit_start: 0,
      limit_length: 10
    }).subscribe((response: any) => {
      if (response && response.success && response.data) {
        const products = response.data;
        this.related = products.filter(x => x.uuid !== this.id);
      }
    });
  }

  checkCartItems() {
    const item = this.cart.cart.filter(x => x.uuid === this.id);
    if (item && item.length) {
      this.quantity = item[0].quantity;
    }
  }

  getProduct() {
    this.api.post('galyon/v1/products/getProductById', {
      uuid: this.id
    }).subscribe((response: any) => {

      this.loaded = true;
      this.gallery = [];
      if (response && response.success && response.data) {
        this.product = response.data;
        this.product.quantity = 0;

        this.name = this.product.name;
        this.description = this.product.description;
        this.subId = this.product.subcategory_id;
        this.coverImage = this.product.cover;
        this.key_features = this.product.features;
        this.disclaimer = this.product.disclaimer;
        this.discount = this.product.discount;

        this.gram = this.product.gram;
        this.have_gram = this.product.have_gram;
        this.kg = this.product.kg;
        this.have_kg = this.product.have_kg;
        this.liter = this.product.liter;
        this.have_liter = this.product.have_liter;
        this.ml = this.product.ml;
        this.have_ml = this.product.have_ml;
        this.pcs = this.product.pcs;
        this.have_pcs = this.product.have_pcs;

        this.in_offer = this.product.is_featured;
        this.in_stock = this.product.in_stock;
        this.is_single = this.product.is_single;
        this.realPrice = parseFloat(this.product.orig_price+'');
        this.sellPrice = parseFloat(this.product.sell_price+'');
        this.status = this.product.status;
        // this.rate = this.product.rating;
        // this.totalRating = this.product.total_rating;
        this.storeId = this.product.store_id;
        this.storeName = this.product.store_name;
        this.storeIsActive = this.product.status == 'true';

        if (this.product.variations && this.product.variations !== '') {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(this.product.variations)) {
            this.product.variations = JSON.parse(this.product.variations);
            this.product.variations.forEach(element => {
              element.current = 0;
            });
          } else {
            this.product.variations = [];
          }
        } else {
          this.product.variations = [];
        }
        
        if (this.cart.checkProductInCart(this.product.uuid)) {
          let filterprod: any = this.cart.cart.filter(x => x.uuid === this.product.uuid);
          this.product.quantity = filterprod[0].quantity;
          this.product.variations.forEach(variant => {
            let cartVariant: any = filterprod[0].variations.filter( x => x.title == variant.title);
            if(cartVariant.length) {
              variant.current = cartVariant[0].current;
            }
          });
        } else {
          this.product.quantity = 0;
        } 
        //this.checkCartItems();

        this.gallery.push(this.coverImage);
        const images = JSON.parse(this.product.images);
        images.forEach(element => {
          this.gallery.push(element);
        });

        this.getRelated();
      }        
    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  getDiscountSuffix() {
    if(this.product.discount_type == 'fixed') {
      return "off";
    } else if(this.product.discount_type == 'percent') {
        return "%";
    } else {
        return "";
    }
  }

  back() {
    this.navCtrl.back();
  }

  ngOnInit() {
  }

  addToCart() {
    // this.quantity = 1;
    // this.productt.quantity = 1;
    this.product.quantity = 1;
    this.cart.addItem(this.product);
  }

  gotoStore() {
    const param: NavigationExtras = {
      queryParams: {
        id: this.storeId,
      }
    };
    this.router.navigate(['user/home/store'], param);
  }

  add() {
    // this.quantity = this.quantity + 1;
    // this.cart.addQuantity(this.quantity, this.id);
    if (this.product.quantity > 0) {
      this.product.quantity = this.product.quantity + 1;
      this.cart.addQuantity(this.product.quantity, this.product.uuid);
    }
  }

  remove() {
    // if (this.quantity === 1) {
    //   this.quantity = 0;
    //   this.cart.removeItem(this.id)
    // } else {
    //   this.quantity = this.quantity - 1;
    //   this.cart.addQuantity(this.quantity, this.id);
    // }
    if (this.product.quantity === 1) {
      this.product.quantity = 0;
      this.cart.removeItem(this.product.uuid)
    } else {
      this.product.quantity = this.product.quantity - 1;
      this.cart.addQuantity(this.product.quantity, this.product.uuid);
    }
  }

  onShare() {

  }

  onFav() {
    if (this.util.favIds.includes(this.id)) {
      console.log('remove this')
      this.util.removeFav(this.id);
      console.log('after removed', this.util.favIds);
      console.log('edit');
      const param = {
        id: localStorage.getItem('uid'),
        ids: this.util.favIds.join()
      };
      this.util.haveFav = true;
      console.log('parama', param)
      this.api.post('favourite/editList', param).subscribe((data: any) => {
        console.log('save response', data);
        if (data && data.status !== 200) {
          this.util.errorToast(this.util.getString('Something went wrong'));
        }
      }, error => {
        console.log('error on save', error);
        this.util.errorToast(this.util.getString('Something went wrong'));
      });
    } else {
      console.log('add new');
      this.util.setFav(this.id);
      console.log('after added', this.util.favIds);
      if (this.util.haveFav) {
        console.log('edit');
        const param = {
          id: localStorage.getItem('uid'),
          ids: this.util.favIds.join()
        };
        this.util.haveFav = true;
        console.log('parama', param)
        this.api.post('favourite/editList', param).subscribe((data: any) => {
          console.log('save response', data);
          if (data && data.status !== 200) {
            this.util.errorToast(this.util.getString('Something went wrong'));
          }
        }, error => {
          console.log('error on save', error);
          this.util.errorToast(this.util.getString('Something went wrong'));
        });
      } else {
        console.log('save');
        const param = {
          uid: localStorage.getItem('uid'),
          ids: this.util.favIds.join()
        };
        this.util.haveFav = true;
        console.log('parama', param)
        this.api.post('favourite/save', param).subscribe((data: any) => {
          console.log('save response', data);
          if (data && data.status !== 200) {
            this.util.errorToast(this.util.getString('Something went wrong'));
          }
        }, error => {
          console.log('error on save', error);
          this.util.errorToast(this.util.getString('Something went wrong'));
        });
      }
    }
  }

  singleProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        uuid: item.uuid
      }
    };

    this.router.navigate(['user/home/product'], param);
  }

  async productRating() {
    const modal = await this.modalController.create({
      component: RatingListPage,
      componentProps: {
        uuid: this.id,
        name: this.name,
        type: 'product'
      }
    });

    modal.onDidDismiss().then((data) => {
      if(data.role == "submit") {
        //Do something if submit.
      }
    });
    return await modal.present();

    // const param: NavigationExtras = {
    //   queryParams: {
    //     uuid: this.id,
    //     name: this.name,
    //     type: 'product'
    //   }
    // }

    // this.router.navigate(['user/home/ratings'], param);
  }

  async variant(var_id) {
    const allData = [];
    if (this.product && this.product.variations.length > 0 && this.product.variations[var_id]) {
      let variant = this.product.variations[var_id];
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
              this.product.variations[var_id].current = data;
          
              let cartProduct: any = this.cart.cart.filter( x => x.uuid == this.product.uuid);
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
