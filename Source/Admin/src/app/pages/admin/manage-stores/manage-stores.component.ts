import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';

import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/services/util.service';
import { CityService } from 'src/app/services/city.service';
import { StoresService } from 'src/app/services/stores.service';
import { Observable, of, OperatorFunction } from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap, catchError, tap} from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { Users } from 'src/app/models/users.model';

declare var google: any;
@Component({
  selector: 'app-manage-stores',
  templateUrl: './manage-stores.component.html',
  styleUrls: ['./manage-stores.component.scss']
})
export class ManageStoresComponent {
  @ViewChild('placesRef', { static: false }) placesRef: GooglePlaceDirective;

  id: any;
  banner_to_upload: any = '';
  new: boolean;
  address: any = '';
  storeAddress: any;
  latitude: any;
  longitude: any;

  haveData: boolean = false;

  coverImage: any;
  gender: any = 1;

  name: any = '';
  descritions: any = '';

  is_featured: any = '0';
  isClosed: any = '0';
  status: any = '0';
 
  commission: any;
  city: any = '';
  openTime: any = '08:00';
  closeTime: any = '17:00';
  time: any = '';

  email: any = '';
  phone: any = '';


  fname: any = '';
  lname: any = '';
  password: any = '';
  
  totalSales: any = 0;
  totalOrders: any = 0;
  reviews: any[] = [];
  cities: any[] = [];
  fileURL: any;
  orders: any[] = [];
  mobileCcode: any = '91';

  vcode: any = '';
  store_email: any = '';
  store_phone: any = '';

  lazada: any = '';
  shopee: any = '';
  
  searching = false;
  searchFailed = false;

  public searchTerm: any = '';
  private selectedUserId: any = '';

  search: OperatorFunction<string, readonly {first_name, cover}[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.api.search(term, 'galyon/v1/users/getAll').pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )

  checkUser() {
    if(typeof this.searchTerm === 'undefined') {
      this.searchTerm = '';
    }
  }

  /**
   * Used to format the result data from the lookup into the
   * display and list values. Maps `{name: "band", id:"id" }` into a string
  */
  resultFormatBandListValue(value: any) {            
    return value.first_name + ' ' + value.last_name;
  } 

  /**
    * Initially binds the string value and then after selecting
    * an item by checking either for string or key/value object.
  */
  inputFormatBandListValue(value: any)   {
    if(value.first_name || value.last_name) {
      localStorage.setItem('store-owner', value.uuid)
      console.log(localStorage.getItem('store-owner'));
      return value.first_name + ' ' + value.last_name;
    }
    return value;
  }

  getStates(data) {
    console.log(data);
  }

  pending: any = '';
  pending_name: any = '';
  pending_description: any = '';
  pending_open: any = '';
  pending_close: any = '';
  pending_serving: any = '';
  pending_phone: any = '';
  pending_email: any = '';
  pending_cover: any = '';

  pending_vcode: any = '';
  pending_lazada: any = '';
  pending_shopee: any = '';

  constructor(
    private route: ActivatedRoute,
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private chMod: ChangeDetectorRef,
    private router: Router,
    public util: UtilService,
    private cityServ: CityService,
    private storeServ: StoresService,
    private userServ: UserService,
  ) {
    this.route.queryParams.subscribe(data => {
      this.new = data.register === 'true' ? true : false;
      
      if (data && data.uuid && data.register) {
        this.id = data.uuid;
        this.storeServ.getStoreById(data.uuid, (response: any) => {
          if(response) {
            this.storeAddress = response.address;
            this.name = response.name;
            this.city = response.city_id;
            this.searchCityTerm = response.city_name;
            this.latitude = response.lat;
            this.longitude = response.lng;
            this.fileURL = response.cover;
            this.coverImage = environment.mediaURL + response.cover;
            this.descritions = response.descriptions;
            this.openTime = response.open_time;
            this.closeTime = response.close_time;
            this.commission = response.commission;
            this.store_email = response.email;
            this.store_phone = response.phone;

            this.vcode = response.vcode;
            this.lazada = response.lazada;
            this.shopee = response.shopee;

            this.is_featured = response.is_featured;
            this.isClosed = response.isClosed;
            this.status = response.status;

            localStorage.setItem('store-owner', response.owner)
            this.searchTerm = response.owner_name;

            this.pending = response.pending_update;
            for (var key in this.pending) {
              if(key == "name") {
                this.pending_name = this.pending.name;
              }
              if(key == "isClosed") {
                this.pending_serving = this.pending.isClosed == "1" ? "Closed" : "Open";
              }
              if(key == "open_time") {
                this.pending_open = this.pending.open_time;
              }
              if(key == "close_time") {
                this.pending_close = this.pending.close_time;
              }
              if(key == "phone") {
                this.pending_phone = this.pending.phone;
              }
              if(key == "email") {
                this.pending_email = this.pending.email;
              }
              if(key == "descriptions") {
                this.pending_description = this.pending.descriptions;
              }
              if(key == "cover") {
                this.pending_cover = api.mediaURL + this.pending.cover;
              }
              if(key == "vcode") {
                this.pending_vcode = this.pending.vcode;
              }
              if(key == "lazada") {
                this.pending_lazada = this.pending.lazada;
              }
              if(key == "shopee") {
                this.pending_shopee = this.pending.shopee;
              }
            }
            //this.getOrders();
          }
        });
        //this.getVenue();
        //this.getReviews();
      }
    });
  }

  
  public searchCityTerm: any = '';
  private selectedCityId: any = '';

  searchingCity = false;
  searchCityFailed = false;

  searchCity: OperatorFunction<string, readonly {name, province}[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => this.searchingCity = true),
      switchMap(term =>
        this.api.search(term, 'galyon/v1/cities/searchCity').pipe(
          tap(() => this.searchCityFailed = false),
          catchError(() => {
            this.searchCityFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searchingCity = false)
    )

  checkCity() {
    if(typeof this.searchCityTerm === 'undefined') {
      this.searchCityTerm = '';
    }
  }

  resultFormatBandListValueCity(value: any) {            
    return value.name + ', ' + value.province;
  } 

  inputFormatBandListValueCity(value: any)   {
    if(value.name || value.province) {
      return value.name + ', ' + value.province;
    }
    return value;
  }

  decideRequest(action) {
    this.spinner.show();
    this.api.post('galyon/v1/stores/decidePending', { 
      uuid: this.id,
      action: action
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.util.success(null);
      } else {
        this.util.error(response.message);
      }
    }, error => {
      this.spinner.hide();
      this.util.error(this.util.getString('Something went wrong'));
      console.log('error', error);
    });
  }

  getOrders() {
    const param = {
      id: this.id
    };

    this.api.post('orders/getByStore', param).then((data: any) => {
      console.log('by store id', data);
      let total = 0;
      if (data && data.status === 200 && data.data.length > 0) {
        data.data.forEach(async (element) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.orders = await element.orders.filter(x => x.store_id === this.id);
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
              const info = JSON.parse(element.status);
              await element.orders.forEach(calc => {
                if (calc.variations && calc.variations !== '' && typeof calc.variations === 'string') {
                  calc.variations = JSON.parse(calc.variations);
                  console.log(calc['variant']);
                  if (calc["variant"] === undefined) {
                    calc['variant'] = 0;
                  }
                }
                if (calc.sell_price === '0.00') {
                  total = total + parseFloat(calc.original_price);
                } else {
                  total = total + parseFloat(calc.sell_price);
                }
              });
              const selected = await info.filter(x => x.id === this.id);
              if (selected && selected.length) {
                const status = selected[0].status;
                element['storeStatus'] = status;
                this.orders.push(element);
              }
            }
          }
        });
        setTimeout(() => {
          function percentage(num, per) {
            return (num / 100) * per;
          }
          console.log(total, this.commission);
          const totalPrice = percentage(total, parseFloat(this.commission));
          console.log('commistion=====>>>>>', totalPrice.toFixed(2));
          this.totalSales = totalPrice.toFixed(2);
          // this.totalAmount = total;
          // this.toPay = this.commisionAmount;
        }, 1000);
      }
    }, error => {
      console.log(error);
      this.util.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.util.error('Something went wrong');
    });
  }

  getReviews() {
    const param = {
      id: this.id,
      where: 'sid = ' + this.id
    };

    this.api.post('rating/getFromIDs', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        this.reviews = data.data;
      }
    }, error => {
      console.log(error);
      this.util.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.util.error('Something went wrong');
    });
  }

  getImage(cover) {
    return cover ? cover : 'assets/images/store.png';
  }

  getDate(date) {
    return moment(date).format('llll');
  }

  public handleAddressChange(address: Address) {
    this.address = address.formatted_address;
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
  }

  updateStore() {

    if (this.name === '' || this.openTime === '' || this.closeTime === '' || !this.openTime || !this.closeTime) {
      this.util.error(this.api.translate('All Fields are required'));
      return false;
    }

    const param = {
      uuid: this.id,
      name: this.name,
      descriptions: this.descritions,
      cover: this.fileURL,
      open_time: this.openTime,
      close_time: this.closeTime,
      city_id: this.searchCityTerm.uuid ? this.searchCityTerm.uuid : "",
      owner: this.searchTerm.uuid ? this.searchTerm.uuid : "",
      email: this.store_email,
      phone: this.store_phone,
      commission: this.commission,
      is_featured: this.is_featured,
      isClosed: this.isClosed,
      status: this.status,

      vcode: this.vcode,
      lazada: this.lazada,
      shopee: this.shopee
    };

    this.spinner.show();
    this.api.post('galyon/v1/stores/editStoreCurrent', param).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.util.success(null);
      } else {
        this.util.error(response.message);
      }
    }, error => {
      this.spinner.hide();
      this.util.error(this.util.getString('Something went wrong'));
      console.log('error', error);
    });
  }

  createStore() {
    if (this.name === '' || this.openTime === '' || this.closeTime === '' || !this.openTime || !this.closeTime) {
      this.util.error(this.api.translate('All Fields are required'));
      return false;
    }

    if(this.email && this.email != '') {
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!(emailfilter.test(this.email))) {
        this.util.error(this.api.translate('Please enter valid email'));
        return false;
      }
    }

    const param = {
      name: this.name,
      descriptions: this.descritions,
      cover: this.fileURL,
      open_time: this.openTime,
      close_time: this.closeTime,
      city_id: this.searchCityTerm.uuid ? this.searchCityTerm.uuid : "",
      owner: this.searchTerm.uuid ? this.searchTerm.uuid : "",
      email: this.store_email,
      phone: this.store_phone,
      commission: this.commission,
      is_featured: this.is_featured,
      isClosed: this.isClosed,
      status: this.status,

      vcode: this.vcode,
      lazada: this.lazada,
      shopee: this.shopee
    };

    this.spinner.show();
    this.api.post('galyon/v1/stores/createNewStore', param).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.util.success(null, () => {
          const navData: NavigationExtras = {
            queryParams: {
              uuid: response.data.uuid,
              register: false
            }
          };
          this.router.navigate(['admin/manage-stores'], navData);
        });
      } else {
        this.util.error(response.message);
      }
    }, error => {
      this.spinner.hide();
      this.util.error(this.util.getString('Something went wrong'));
      console.log('error', error);
    });
  }

  preview_banner(files) {

    console.log('fle', files);
    this.banner_to_upload = [];
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    this.banner_to_upload = files;
    if (this.banner_to_upload) {
      this.spinner.show();
      this.api.uploadFile(this.banner_to_upload).subscribe((response: any) => {
        this.spinner.hide();
        if (response && response.success && response.data) {
          this.fileURL = response.data;
          this.coverImage = environment.mediaURL + response.data;
        }
      }, err => {
        console.log(err);
        this.spinner.hide();
      });
    } else {
      console.log('no');
    }
  }

  getCurrency() {
    return this.api.getCurrecySymbol();
  }

  editAddress(address: any) {
    const navData: NavigationExtras = {
      queryParams: {
        uuid: this.id,
        from: 'store',
        address_id: address ? address.uuid : null
      }
    };
    this.router.navigate(['admin/manage-address'], navData);
  }

  goBack() {
    this.navCtrl.back();
  }
}
