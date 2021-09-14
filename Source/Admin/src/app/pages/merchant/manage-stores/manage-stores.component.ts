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

  coverImage: any;
  gender: any = 1;

  name: any = '';
  descritions: any = '';
  haveData: boolean = false;
  time: any = '';
  commission: any;
  email: any = '';
  openTime;
  closeTime;
  fname: any = '';
  lname: any = '';
  password: any = '';
  phone: any = '';
  city: any = '';
  totalSales: any = 0;
  totalOrders: any = 0;
  reviews: any[] = [];
  cities: any[] = [];
  fileURL: any;
  orders: any[] = [];
  mobileCcode: any = '91';

  store_email: any = '';
  store_phone: any = '';
  
  searching = false;
  searchFailed = false;
  public searchTerm: any = '';
  private selectedUserId: any = '';

  is_featured: any = '';
  isClosed: any = '';
  status: any = '';

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
    this.id = this.storeServ.storeValue.uuid;
    this.storeServ.getStoreById(this.id, (response: any) => {
      if(response) {
        this.storeAddress = response.address;
        this.name = response.name;
        this.city = response.city_id;
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
          console.log(this.pending[key]);
        }
        //this.getOrders();
      }
    });
    //this.getVenue();
    //this.getReviews();
    this.cityServ.request(activeCities => {
      this.cities = activeCities;
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

  updateVenue() {

    if (this.name === '' || this.openTime === '' || this.closeTime === '' || !this.openTime || !this.closeTime) {
      this.util.error(this.api.translate('All Fields are required'));
      return false;
    }

    //TODO: Add Geocoder
    // const geocoder = new google.maps.Geocoder;
    // geocoder.geocode({ address: this.address }, (results, status) => {
    //   console.log(results, status);
    //   if (status === 'OK' && results && results.length) {
    //     this.latitude = results[0].geometry.location.lat();
    //     this.longitude = results[0].geometry.location.lng();
    //     console.log('----->', this.latitude, this.longitude);
    //   } else {
    //     alert('Geocode was not successful for the following reason: ' + status);
    //     return false;
    //   }
    // });

    const param = {
      uuid: this.id,
      name: this.name,
      descriptions: this.descritions,
      cover: this.fileURL,
      open_time: this.openTime,
      close_time: this.closeTime,
      //city_id: this.city,
      owner: localStorage.getItem('store-owner'),
      email: this.store_email,
      phone: this.store_phone,
      //commission: this.commission,
      //is_featured: this.is_featured,
      isClosed: this.isClosed,
      //status: this.status
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

  create() {
    console.log('mobile code', this.mobileCcode);
    console.log(this.email, this.fname, this.lname, this.phone, this.password, this.name, this.address, this.descritions, this.time)
    if (this.email === '' || this.fname === '' || this.lname === '' || this.phone === '' || this.password === ''
      || this.name === '' || this.address === '' || this.descritions === ''
      || this.city === '' || !this.city || this.openTime === '' || this.closeTime === '' ||
      !this.openTime || !this.closeTime || !this.commission || this.commission === '') {
      this.util.error(this.api.translate('All Fields are required'));
      return false;
    }

    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(this.email))) {
      this.util.error(this.api.translate('Please enter valid email'));
      return false;
    }

    if (!this.coverImage || this.coverImage === '') {
      this.util.error(this.api.translate('Please add your cover image'));
      return false;
    }

    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ address: this.address }, (results, status) => {
      console.log(results, status);
      if (status === 'OK' && results && results.length) {
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
        return false;
      }
    });

    const userParam = {
      first_name: this.fname,
      last_name: this.lname,
      email: this.email,
      password: this.password,
      gender: this.gender,
      fcm_token: 'NA',
      type: 'store',
      lat: this.latitude,
      lng: this.longitude,
      cover: this.fileURL,
      mobile: this.phone,
      status: 1,
      verified: 1,
      others: 1,
      date: moment().format('YYYY-MM-DD'),
      stripe_key: '',
      country_code: '+' + this.mobileCcode
    };

    console.log('user param', userParam);

    this.spinner.show();
    this.api.post('users/registerUser', userParam).then((data: any) => {
      console.log('datatatrat=a=ta=t=at=', data);
      if (data && data.data && data.status === 200) {
        const storeParam = {
          uid: data.data.id,
          name: this.name,
          mobile: this.phone,
          lat: this.latitude,
          lng: this.longitude,
          verified: 1,
          address: this.address,
          descriptions: this.descritions,
          images: '[]',
          cover: this.fileURL,
          status: 1,
          open_time: this.openTime,
          close_time: this.closeTime,
          isClosed: 1,
          certificate_url: '',
          certificate_type: '',
          rating: 0,
          total_rating: 0,
          cid: this.city,
          commission: this.commission
        };
        console.log('****', storeParam);
        this.api.post('stores/save', storeParam).then((salons: any) => {
          this.spinner.hide();
          this.util.success(null);
        }, error => {
          this.spinner.hide();
          console.log(error);
          this.util.error(this.api.translate('Something went wrong'));
        }).catch(error => {
          this.spinner.hide();
          console.log(error);
          this.util.error(this.api.translate('Something went wrong'));
        });
      } else {
        this.spinner.hide();
        if (data && data.data && data.data.message) {
          this.util.error(data.data.message);
          return false;
        }
        this.util.error(data.message);
        return false;
      }
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
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
      console.log('ok');
      this.spinner.show();
      this.api.uploadFile(this.banner_to_upload).subscribe((data: any) => {
        console.log('==>>', data);
        this.spinner.hide();
        if (data && data.status === 200 && data.data) {
          this.fileURL = data.data;
          this.coverImage = environment.mediaURL + data.data;
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