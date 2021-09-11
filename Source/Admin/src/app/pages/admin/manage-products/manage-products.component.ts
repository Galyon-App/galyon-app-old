import { Location } from '@angular/common';
/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent {
  @ViewChild('content', { static: false }) content: any;
  @ViewChild('contentSub', { static: false }) contentSub: any;
  @ViewChild('contentVarient', { static: false }) contentVarient: any;
  @ViewChild('contentStore', { static: false }) contentStore: any;

  id: any;

  coverImage: any = '';
  images: any[] = [];
  name: any = '';
  realPrice: any = 0.00;
  sellPrice: any = 0.00;
  discount_type: any = 'fixed';
  discount: any = 0.00;
  status: any = '1';
  in_stock: any = '1';
  in_offer: any = '0';
  is_single: any = '1';
  is_featured: any = '0';

  have_pcs: any = '0';
  pcs: any;
  have_gram: any = '0';
  gram: any;
  have_kg: any = '0';
  kg: any;
  have_liter: any = '0';
  liter: any;
  have_ml: any = '0';
  ml: any;

  description: any = '';
  key_features: any = '';
  disclaimer: any = '';

  variations: any[] = [];

  category: any[] = [];
  dummyCates: any[] = [];
  cateString: any = '';
  cateId: any = '';
  cateName: any = '';

  subCates: any = [] = [];
  dummySubCates: any[] = [];
  subString: any = '';
  subId: any = '';
  subName: any = '';

  stores: any = [] = [];
  dummyStores: any[] = [];
  storeString: any = '';
  storeId: any = '';
  storeName: any= '';

  variant_title: any = '';
  variant_price: any;
  variant_discount: any;
  variatIndex: number;
  subIndex: any;
  sub: boolean;

  rating: any;
  total_rating: any;

  constructor(
    public api: ApisService,
    public util: UtilService,
    public route: ActivatedRoute,
    private navCtrl: Location,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
  ) {
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.uuid) {
        this.id = data.uuid;
        this.getCurrentProduct();
      }
    });
  }

  addPreview() {
    this.images.push('');
  }

  removePreview(pos) {
    this.images.splice(pos, 1);
  }

  displayPreview(files, num = null) {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    if (files) {
      this.spinner.show();
      this.api.uploadFile(files).subscribe((response: any) => {
        this.spinner.hide();
        if (response && response.status === 200 && response.data) {
          if(num !== null) {
            this.images[num] = response.data;
          } else {
            this.coverImage = response.data;
          }
        }
      }, err => {
        console.log(err);
        this.spinner.hide();
      });
    } else {
      console.log('no');
    }
  }

  protected setProductDetail(response) {
    const info = response.data;

    this.coverImage = info.cover;
    this.images = JSON.parse(info.images);
    this.name = info.name;
    this.realPrice = parseFloat(info.orig_price);
    this.sellPrice = parseFloat(info.sell_price);
    this.discount_type = info.discount_type;
    this.discount = info.discount;
    this.status = info.status;
    this.in_stock = info.in_stock;
    this.in_offer = info.in_home;
    this.is_single = info.is_single;
    this.is_featured = info.is_featured;

    this.gram = info.gram;
    this.have_gram = info.have_gram;
    this.kg = info.kg;
    this.have_kg = info.have_kg;
    this.liter = info.liter;
    this.have_liter = info.have_liter;
    this.ml = info.ml;
    this.have_ml = info.have_ml;
    this.pcs = info.pcs;
    this.have_pcs = info.have_pcs;

    this.description = info.description;
    this.key_features = info.features;
    this.disclaimer = info.disclaimer;

    //TODO
    this.storeId = info.store_id;
    this.storeName = info.store_name;

    this.api.get('galyon/v1/stores/getAllStores').then((response: any) => {
      if (response && response.success && response.data) {
        this.stores = response.data;
        this.dummyStores = this.stores;
      } else {
        this.util.error(this.util.getString('No category found'));
      }
    }, error => {
      this.util.error(this.util.getString('Something went wrong'));
      console.log(error);
    });

    this.cateId = info.category_id;
    this.subId = info.subcategory_id;
    this.variations = JSON.parse(info.variations);

    this.api.get('galyon/v1/category/getAllCategorys').then((response: any) => {
      if (response && response.success && response.data) {
        this.category = response.data.filter(x => x.parent_id == null);
        this.dummyCates = this.category;
        const parent = this.category.filter(x => x.uuid === this.cateId);
        this.cateName = parent[0].name;

        this.subCates = response.data.filter(x => x.parent_id == this.cateId);
        this.dummySubCates = this.subCates;
        const child = this.subCates.filter(x => x.uuid === this.subId);
        if(child.length > 0) {
          this.subName = child[0].name;
        }
      } else {
        this.util.error(this.util.getString('No category found'));
      }
    }, error => {
      this.util.error(this.util.getString('Something went wrong'));
      console.log(error);
    });



    this.rating = info.rating;
    this.total_rating = info.total_rating;
  }

  getCurrentProduct() {
    this.spinner.show();
    this.api.post('galyon/v1/products/getProductById', {
      uuid: this.id
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.setProductDetail(response);
      } else {
        this.util.error(response.message);
      }
    }, error => {
      this.spinner.hide();
      this.util.error(this.api.translate('Something went wrong'));
      console.log(error);
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  onDicount(value) {
    value = parseFloat(value);
    if(this.discount_type == 'percent') {
      if (this.realPrice && value <= 99) {
        this.percentage(this.discount, this.realPrice);
      } else {
        this.discount = 0;
        this.percentage(this.discount, this.realPrice);
      }
    } else {
      if (this.discount <= this.realPrice) {
        this.sellPrice = this.realPrice - this.discount;
      } else {
        this.discount = this.realPrice;
      }
    }
  }

  percentage(percent, total) {
    this.sellPrice = 0;
    const price = ((percent / 100) * total);
    this.sellPrice = this.realPrice - price;
  }

  onRealPrice(value) {
    value = parseFloat(value);
    if (this.sellPrice && value > 1) {
      this.percentage(this.discount, this.realPrice);
    }
  }

  openCate() {
    try {
      this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    } catch (error) {
      console.log(error);
    }
  }
  close() {
    if (this.cateId) {
      const name = this.category.filter(x => x.uuid === this.cateId);
      this.cateName = name[0].name;

      this.subId = '';
      this.subName = '';
      this.subCates = this.subCates.filter(x => x.parent_id === this.cateId);
      this.dummySubCates = this.subCates;
    }
    this.modalService.dismissAll();
  }
  searchCates(str) {
    this.category = this.dummyCates.filter((ele: any) => {
      return ele.name.toLowerCase().includes(str.toLowerCase());
    });
  }

  openSub() {
    if (this.cateId) {
      this.spinner.show();
      this.api.post('galyon/v1/category/getChildCategorys', {
        parent_id: this.cateId
      }).then((response: any) => {
        this.spinner.hide();
        if (response && response.success && response.data) {
          this.subCates = response.data;
          this.dummySubCates = this.subCates;
          const child = this.subCates.filter(x => x.uuid === this.subId);
          if(child.length > 0) {
            this.subName = child[0].name;
          }
          
        } else {
          this.util.error(this.util.getString('No category found'));
        }
      }, error => {
        this.spinner.hide();
        this.util.error(this.util.getString('Something went wrong'));
        console.log(error);
      });
      try {
        this.modalService.open(this.contentSub, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
          console.log(result);
        }, (reason) => {
          console.log(reason);
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      this.util.error('Please select parent category first');
    }
  }
  close2() {
    if (this.subId) {
      const name = this.subCates.filter(x => x.uuid === this.subId);
      this.subName = name[0].name;
    }
    this.modalService.dismissAll();
  }
  searchSubCate(str) {
    this.subCates = this.dummySubCates.filter((ele: any) => {
      return ele.name.toLowerCase().includes(str.toLowerCase());
    });
  }

  openStore() {
    if (this.storeId) {
      this.spinner.show();
      this.api.get('galyon/v1/stores/getAllStores').then((response: any) => {
        this.spinner.hide();
        if (response && response.success && response.data) {
          this.stores = response.data;
          this.dummyStores = this.stores;
          const child = this.stores.filter(x => x.uuid === this.storeId);
          if(child.length > 0) {
            this.storeName = child[0].name;
          }
        } else {
          this.util.error(this.util.getString('No category found'));
        }
      }, error => {
        this.spinner.hide();
        this.util.error(this.util.getString('Something went wrong'));
        console.log(error);
      });
      try {
        this.modalService.open(this.contentStore, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
          console.log(result);
        }, (reason) => {
          console.log(reason);
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      this.util.error('Please select parent category first');
    }
  }
  close4() {
    if (this.storeId) {
      const name = this.stores.filter(x => x.uuid === this.storeId);
      this.storeName = name[0].name;
    }
    this.modalService.dismissAll();
  }
  searchStore(str) {
    this.stores = this.dummyStores.filter((ele: any) => {
      return ele.name.toLowerCase().includes(str.toLowerCase());
    });
  }

  curVar: any='';
  changeSize(event) {
    const items = this.variations.filter(x => x.title === this.curVar);
    if(items.length === 0) {
      this.variant_title = '';
      this.variant_price = 0;
      this.variant_discount = 0;
      this.variatIndex = 0;
      const item = {
        title: this.curVar,
        type: 'radio',
        items: []
      };
      this.variations.push(item);
    } else {
      this.util.error(this.util.getString('Variant currently existing'));
    }
  }

  async addItem(index) {
    this.sub = false;
    this.variant_title = '';
    this.variant_price = 0;
    this.variant_discount = 0;
    this.variatIndex = index;
    try {
      this.modalService.open(this.contentVarient, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  delete(item) {
    if (item.title === 'variant') {
      this.variations = [];
    }
    this.variations = this.variations.filter(x => x.title !== item.title);
  }

  close3() {
    if (this.sub === false) {
      if (this.variant_title) {
        this.variant_price = this.variant_price ? this.variant_price : 0;
        this.variant_discount = this.variant_discount ? this.variant_discount : 0;
        const item = {
          title: this.variant_title,
          price: parseFloat(this.variant_price),
          discount: this.variant_discount && this.variant_discount ? parseFloat(this.variant_discount) : 0
        };
        console.log(this.variatIndex);
        this.variations[this.variatIndex].items.push(item);
        this.modalService.dismissAll();
      } else {
        this.util.error(this.util.getString('Please add title'));
      }
    } else {
      if (this.variant_title) {
        this.variant_price = this.variant_price ? this.variant_price : 0;
        this.variant_discount = this.variant_discount ? this.variant_discount : 0;
        this.variations[this.variatIndex].items[this.subIndex].title = this.variant_title;
        this.variations[this.variatIndex].items[this.subIndex].price = parseFloat(this.variant_price),
          this.variations[this.variatIndex].items[this.subIndex].discount =
          this.variant_discount && this.variant_discount ? parseFloat(this.variant_discount) : 0;
        this.modalService.dismissAll();
      } else {
        this.util.error(this.util.getString('Please add title'));
      }
    }

  }
  deleteSub(index, item) {
    const selected = this.variations[index].items;
    const data = selected.filter(x => x.title !== item.title);
    this.variations[index].items = data;
  }

  async editSub(index, items, subIndex) {
    this.sub = true;
    this.variatIndex = index;
    this.subIndex = subIndex;
    this.variant_title = this.variations[index].items[subIndex].title;
    this.variant_price = this.variations[index].items[subIndex].price;
    this.variant_discount = this.variations[index].items[subIndex].discount;
    try {
      this.modalService.open(this.contentVarient, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    } catch (error) {
      console.log(error);
    }
  }

  submit() {
    this.images = this.images.filter((x) => x != '');
    const param = {
      uuid: this.id,
      store_id: this.storeId,
      cover: this.coverImage,
      images: JSON.stringify(this.images),

      name: this.name,
      description: this.description,
      features: this.key_features,
      disclaimer: this.disclaimer,

      orig_price: this.realPrice,
      sell_price: this.sellPrice ? this.sellPrice : 0,
      discount: this.discount,
      discount_type: this.discount_type,
      
      category_id: this.cateId,
      subcategory_id: this.subId,

      have_pcs: this.have_pcs,
      pcs: this.have_pcs === '1' ? this.pcs : 0,
      have_gram: this.have_gram,
      gram: this.have_gram === '1' ? this.gram : 0,
      have_kg: this.have_kg,
      kg: this.have_kg === '1' ? this.kg : 0,
      have_liter: this.have_liter,
      liter: this.have_liter === '1' ? this.liter : 0,
      have_ml: this.have_ml,
      ml: this.have_ml === '1' ? this.ml : 0,

      status: this.status,
      in_stock: this.in_stock,
      in_home: this.in_offer,
      is_single: this.is_single,
      is_featured: this.is_featured,
      
      variations: JSON.stringify(this.variations)
    };

    this.spinner.show();
    this.api.post('galyon/v1/products/editProductToStore', param).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        //TODO: Ask to go back!
        this.navCtrl.back();
      } else {
        this.util.error(response.message);
      }
    }, error => {
      this.spinner.hide();
      this.util.error(this.util.getString('Something went wrong'));
      console.log('error', error);
    });
  }
}