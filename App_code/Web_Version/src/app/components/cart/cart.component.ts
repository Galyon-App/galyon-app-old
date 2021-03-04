/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { RazorPayService } from 'src/app/services/razorPay';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';
import { ModalDirective } from 'angular-bootstrap-md';
declare var google;
declare let Razorpay: any;
declare let PaystackPop: any;
declare let FlutterwaveCheckout: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit {
  @ViewChild('offersModal') public offersModal: ModalDirective;
  @ViewChild('addressFromMap') public addressFromMap: ModalDirective;
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  @ViewChild('changedPlace') public changedPlace: ModalDirective;
  @ViewChild('frame') public frame: ModalDirective;
  deliveryOption: any = 'home';
  datetime: any;
  tabID = 1;
  myaddress: any[] = [];
  selectedAddress: any;
  RAZORPAY_OPTIONS = {
    'key': '',
    'amount': 0,
    'name': 'Groceryee',
    'order_id': '',
    'description': 'Grocery Payment',
    'image': this.api.mediaURL + this.util.logo,
    'prefill': {
      'name': '',
      'email': '',
      'contact': '',
      'method': ''
    },
    'modal': {},
    'theme': {
      'color': '#45C261'
    }
  };
  public payPalConfig?: IPayPalConfig;
  payId: any;
  offers: any[] = [];
  cards: any[] = [];
  token: any;
  storeAddress: any[] = [];
  isCOD: any = false;
  time: any;
  addCard: boolean;
  today: any;
  nextDay: any;

  offerName: any;
  address_id: any;
  lat: any;
  lng: any;
  address: any = '';
  house: any = '';
  landmark: any = '';
  title: any = 'home';
  pincode: any = '';
  map: any;
  marker: any;

  // autocomplete1: { 'query': string };
  query: any = '';
  autocompleteItems1: any = [];
  GoogleAutocomplete;
  geocoder: any;
  addressSelected: boolean;
  payMethods: any;
  editClicked: boolean;

  cnumber: any = '';
  cname: any = '';
  cvc: any = '';
  date: any = '';
  email: any = '';
  constructor(
    private router: Router,
    public api: ApiService,
    public cart: CartService,
    public util: UtilService,
    private razorpayService: RazorPayService,
    private cd: ChangeDetectorRef,
  ) {
    this.getPayments();
    this.addCard = false;
    if (this.cart.cart.length > 0) {
      this.getStoreList();
    }
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.query = '';
    this.autocompleteItems1 = [];
    this.addressSelected = false;
    this.getAddress();
    this.getOffers();
    this.datetime = 'today';
    this.time = this.util.translate('Today - ') + moment().format('dddd, MMMM Do YYYY');

    this.today = moment().format('dddd, MMMM Do YYYY');
    this.nextDay = moment().add(1, 'days').format('dddd, MMMM Do YYYY');
  }

  ngOnInit(): void {
  }
  private smoothScrollTop(): void {
    let pos = window.pageYOffset;
    console.log('position', pos);
    window.scrollTo(0, 10); // how far to scroll on each step
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }


  getPayments() {
    this.api.get('payments').then((data: any) => {
      console.log(data);
      if (data && data.status === 200 && data.data) {
        const info = data.data.filter(x => x.status === '1');
        console.log('total payments', info);
        if (info && info.length > 0) {
          console.log('---->>', info);
          this.cart.havePayment = true;
          const stripe = info.filter(x => x.id === '1');
          const cod = info.filter(x => x.id === '2');
          const paypal = info.filter(x => x.id === '3');
          const razor = info.filter(x => x.id === '4');
          const paytm = info.filter(x => x.id === '5');
          const insta = info.filter(x => x.id === '6');
          const paystack = info.filter(x => x.id === '7');
          const flutterwave = info.filter(x => x.id === '8');
          this.cart.havePayTM = paytm && paytm.length > 0 ? true : false;
          this.cart.havePayPal = paypal && paypal.length > 0 ? true : false;
          this.cart.haveStripe = stripe && stripe.length > 0 ? true : false;
          this.cart.haveRazor = razor && razor.length > 0 ? true : false;
          this.cart.haveCOD = cod && cod.length > 0 ? true : false;
          this.cart.haveInstamojo = insta && insta.length > 0 ? true : false;
          this.cart.havePayStack = paystack && paystack.length > 0 ? true : false;
          this.cart.haveFlutterwave = flutterwave && flutterwave.length > 0 ? true : false;
          if (this.cart.haveStripe) {
            // this.util.stripe = stripe;
            if (stripe) {
              const creds = JSON.parse(stripe[0].creds);
              if (stripe[0].env === '1') {
                this.util.stripe = creds.live;
              } else {
                this.util.stripe = creds.test;
              }
              if (this.util.userInfo && this.util.userInfo.stripe_key) {
                this.getCards();
              }
              this.util.stripeCode = creds && creds.code ? creds.code : 'USD';
            }
            console.log('============>>', this.util.stripe);
          }


          if (this.cart.haveInstamojo) {
            const datas = info.filter(x => x.id === '6');
            this.cart.instaENV = datas[0].env;
            if (insta) {
              const instaPay = JSON.parse(datas[0].creds);
              this.cart.instamojo = instaPay;
              console.log('instaMOJO', this.cart.instamojo);
            }
          }

          if (this.cart.havePayPal) {
            if (paypal) {
              const creds = JSON.parse(paypal[0].creds);
              if (paypal[0].env === '1') {
                this.util.paypal = creds.live;
              } else {
                this.util.paypal = creds.test;
              }
              if (this.cart.havePayPal) {
                this.initConfig();
              }
              this.util.paypalCode = creds && creds.code ? creds.code : 'USD';
            }
          }

          if (this.cart.haveRazor) {
            if (razor) {
              const creds = JSON.parse(razor[0].creds);
              if (razor[0].env === '1') {
                this.util.razor = creds.live;
              } else {
                this.util.razor = creds.test;
              }
              if (this.cart.haveRazor) {
                this.initRazor();
              }
              this.util.razorCode = creds && creds.code ? creds.code : 'INR';
            }
          }

          if (this.cart.havePayTM) {
            if (paytm) {
              const creds = JSON.parse(paytm[0].creds);
              this.cart.paytmENV = paytm[0].env;
              this.cart.paytmCreds = creds;
              console.log('creds=============>>>>>>>PAYRMMMMM', creds);
            }
          }

          if (this.cart.havePayStack) {
            if (paystack) {
              const creds = JSON.parse(paystack[0].creds);
              this.cart.paystack = creds;
              console.log('paystack creds=======>>>>>', this.cart.paystack);
            }
          }

          if (this.cart.haveFlutterwave) {
            if (flutterwave) {
              const creds = JSON.parse(flutterwave[0].creds);
              this.cart.flutterwave = creds;
              console.log('fluterwave creds=>>', this.cart.flutterwave);
            }
          }
        } else {
          this.cart.havePayment = false;
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      } else {
        this.cart.havePayment = false;
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.cart.havePayment = false;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.cart.havePayment = false;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  paystackPay() {
    const handler = PaystackPop.setup({
      key: this.cart.paystack.pk,
      email: this.util.userInfo.email,
      amount: this.cart.grandTotal * 100,
      firstname: this.util.userInfo.first_name,
      lastname: this.util.userInfo.last_name,
      ref: '' + Math.floor((Math.random() * 1000000000) + 1),
      onClose: () => {
        console.log('closed');
      },
      callback: (response) => {
        console.log(response);
        // response.reference
        this.createOrder('paystack', response.reference);
      }
    });
    handler.openIframe();
  }


  initRazor() {
    this.razorpayService
      .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
      .subscribe();
  }

  handleChange(event) {
    console.log(event);
    this.deliveryOption = event;
  }

  getName() {
    return this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name + ' ' +
      this.util.userInfo.last_name : 'Groceryee';
  }

  getEmail() {
    return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'info@groceryee.com';
  }

  instaPay() {
    let curl;
    if (this.cart.instaENV === '0') {
      curl = 'https://test.instamojo.com/api/1.1/payment-requests/';
    } else {
      curl = 'https://www.instamojo.com/api/1.1/payment-requests/';
    }
    const callbackURL = window.location.origin + '/instamojocallback?method=instamojo&';
    const param = {
      allow_repeated_payments: 'False',
      amount: this.cart.grandTotal,
      name: this.getName(),
      purpose: 'Groceryee order',
      redirect_url: callbackURL,
      phone: this.util.userInfo && this.util.userInfo.mobile ? this.util.userInfo.mobile : '',
      send_email: 'True',
      webhook: this.api.baseUrl,
      send_sms: 'True',
      email: this.getEmail(),
      key: this.cart.instamojo.key,
      token: this.cart.instamojo.token,
      url: curl
    };

    this.util.start();
    this.api.post('users/instamojoRequest', param).then((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status === 200) {
        const info = JSON.parse(data.data);
        console.log('info', info);
        if (info && info.success === true) {
          localStorage.setItem('cartItems', JSON.stringify(this.cart.cart));
          localStorage.setItem('deliveryAt', this.cart.deliveryAt);
          localStorage.setItem('datetime', this.cart.datetime);
          localStorage.setItem('totalPrice', this.cart.totalPrice);
          localStorage.setItem('orderTax', this.cart.orderTax);
          localStorage.setItem('grandTotal', this.cart.grandTotal);
          localStorage.setItem('deliveryPrice', this.cart.deliveryPrice);
          localStorage.setItem('appliedCoupon', JSON.stringify(this.cart.coupon));
          localStorage.setItem('discount', this.cart.discount);
          localStorage.setItem('userOrderTaxByStores', JSON.stringify(this.cart.userOrderTaxByStores));
          localStorage.setItem('selectedAddress', JSON.stringify(this.cart.deliveryAddress));
          window.open(info.payment_request.longurl, '_self');
        } else {
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      } else {
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.stop();
      this.util.errorMessage(this.util.translate('Something went wrong'));
      console.log(error);
    }).catch((error) => {
      this.util.stop();
      this.util.errorMessage(this.util.translate('Something went wrong'));
      console.log(error);
    });
  }

  flutterPay() {
    const callbackURL = window.location.origin + '/flutterwavecallback?method=flutterwave&';
    localStorage.setItem('cartItems', JSON.stringify(this.cart.cart));
    localStorage.setItem('deliveryAt', this.cart.deliveryAt);
    localStorage.setItem('datetime', this.cart.datetime);
    localStorage.setItem('totalPrice', this.cart.totalPrice);
    localStorage.setItem('orderTax', this.cart.orderTax);
    localStorage.setItem('grandTotal', this.cart.grandTotal);
    localStorage.setItem('deliveryPrice', this.cart.deliveryPrice);
    localStorage.setItem('appliedCoupon', JSON.stringify(this.cart.coupon));
    localStorage.setItem('discount', this.cart.discount);
    localStorage.setItem('userOrderTaxByStores', JSON.stringify(this.cart.userOrderTaxByStores));
    localStorage.setItem('selectedAddress', JSON.stringify(this.cart.deliveryAddress));
    FlutterwaveCheckout({
      public_key: this.cart.flutterwave.pk,
      tx_ref: '' + Math.floor((Math.random() * 1000000000) + 1),
      amount: this.cart.grandTotal,
      currency: this.cart.flutterwave.code,
      payment_options: 'card, mobilemoneyghana, ussd',
      redirect_url: // specified redirect URL
        callbackURL,
      meta: {
        consumer_id: 23,
        consumer_mac: '92a3-912ba-1192a',
      },
      customer: {
        email: this.getEmail(),
        phone_number: this.util.userInfo.mobile,
        name: this.getName(),
      },
      callback: (data) => {
        console.log(data);
      },
      onclose: () => {
        console.log('closed');
      },
      customizations: {
        title: 'Groceryee',
        description: 'Groceryee order',
        logo: this.api.mediaURL + this.util.logo,
      },
    });
  }

  payTm() {
    // payFromWeb
    const orderId = this.util.makeid(20);
    const callbackURL = window.location.href + '?method=paytm&key=' + orderId;

    const param = {
      ORDER_ID: orderId,
      CUST_ID: localStorage.getItem('uid'),
      INDUSTRY_TYPE_ID: 'Retail',
      CHANNEL_ID: 'WAP',
      TXN_AMOUNT: this.cart.grandTotal ? this.cart.grandTotal : 5,
      callback: callbackURL
    };
    localStorage.setItem('payTMOrderID', orderId);
    localStorage.setItem('cartItems', JSON.stringify(this.cart.cart));
    localStorage.setItem('deliveryAt', this.cart.deliveryAt);
    localStorage.setItem('datetime', this.cart.datetime);
    localStorage.setItem('totalPrice', this.cart.totalPrice);
    localStorage.setItem('orderTax', this.cart.orderTax);
    localStorage.setItem('grandTotal', this.cart.grandTotal);
    localStorage.setItem('deliveryPrice', this.cart.deliveryPrice);
    localStorage.setItem('appliedCoupon', JSON.stringify(this.cart.coupon));
    localStorage.setItem('discount', this.cart.discount);
    localStorage.setItem('userOrderTaxByStores', JSON.stringify(this.cart.userOrderTaxByStores));
    localStorage.setItem('selectedAddress', JSON.stringify(this.cart.deliveryAddress));
    console.log('to url===>', this.api.JSON_to_URLEncoded(param));
    const url = this.api.baseUrl + 'paytm/payFromWeb?' + this.api.JSON_to_URLEncoded(param);
    window.open(url, '_self');
  }

  getOffers() {
    this.api.get('offers').then((data: any) => {
      console.log(data);
      if (data && data.status === 200 && data.data && data.data.length) {
        const info = data.data.filter(x => x.status === '1');
        this.offers = info;
      }
    }, error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: this.util.paypalCode,
      clientId: this.util.paypal,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: this.util.paypalCode,
            value: this.cart.grandTotal,
            breakdown: {
              item_total: {
                currency_code: this.util.paypalCode,
                value: this.cart.grandTotal
              }
            }
          },
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);

        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        // this.showSuccess = true;
        this.payId = data.id;
        this.createOrder('paypal', this.payId);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        // this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        // this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      },
    };
  }

  getCards() {
    console.log(this.util.userInfo.stripe_key);
    this.api.httpGet('https://api.stripe.com/v1/customers/' + this.util.userInfo.stripe_key +
      '/sources?object=card', this.util.stripe).subscribe((cards: any) => {
        console.log(cards);
        if (cards && cards.data) {
          this.cards = cards.data;
          this.token = this.cards[0].id;
        }
      }, (error) => {
        console.log(error);
        if (error && error.error && error.error.error && error.error.error.message) {
          this.util.errorMessage(error.error.error.message);
          return false;
        }
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
  }

  public razorPayConfig() {
    this.RAZORPAY_OPTIONS.key = this.util.razor;
    this.RAZORPAY_OPTIONS.amount = this.cart.grandTotal * 100;
    this.RAZORPAY_OPTIONS.prefill.email = this.util.userInfo.email;

    this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);

    const razorpay = new Razorpay(this.RAZORPAY_OPTIONS);
    razorpay.open();
  }


  public razorPaySuccessHandler(response) {
    console.log('->', response);
    this.payId = response.razorpay_payment_id;
    this.createOrder('razor', this.payId);
    this.cd.detectChanges();
  }


  async createOrder(payMethod, payKey) {
    //////////// new
    //////////// new

    const storeId = [...new Set(this.cart.cart.map(item => item.store_id))];
    const orderStatus = [];
    storeId.forEach(element => {
      const info = {
        id: element,
        status: 'created'
      };
      orderStatus.push(info);
    });
    const notes = [
      {
        status: 1,
        value: 'Order Created',
        time: moment().format('lll'),
      }
    ];
    const param = {
      uid: localStorage.getItem('uid'),
      store_id: storeId.join(),
      date_time: this.cart.datetime === 'today' ? moment().format('YYYY-MM-DD HH:mm:ss') : moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      paid_method: payMethod,
      order_to: this.cart.deliveryAt,
      orders: JSON.stringify(this.cart.cart),
      notes: JSON.stringify(notes),
      address: this.cart.deliveryAt === 'home' ? JSON.stringify(this.cart.deliveryAddress) : '',
      driver_id: '',
      total: this.cart.totalPrice,
      tax: this.cart.orderTax,
      grand_total: this.cart.grandTotal,
      delivery_charge: this.cart.deliveryPrice,
      coupon_code: this.cart.coupon ? JSON.stringify(this.cart.coupon) : '',
      discount: this.cart.discount,
      pay_key: payKey,
      status: JSON.stringify(orderStatus),
      assignee: '',
      extra: JSON.stringify(this.cart.userOrderTaxByStores)
    }

    console.log('param----->', param);

    this.util.start();
    this.api.post('orders/save', param).then((data: any) => {
      console.log(data);
      this.util.stop();
      this.api.createOrderNotification(this.cart.stores);
      this.cart.clearCart();
      this.util.publishNewOrder();
      // this.router.navigate(['order']);
      const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
      this.router.navigate(['user', name, 'order']);
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch((error) => {
      console.log(error);
      this.util.stop();
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }


  haveSigned() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid !== 'null') {
      return true;
    }
    return false;
  }

  login() {
    this.util.publishModalPopup('login');
  }

  getAddress() {
    const param = {
      id: localStorage.getItem('uid')
    };
    this.myaddress = [];
    this.api.post('address/getByUid', param).then((data: any) => {
      console.log('addreess------------', data);
      if (data && data.status === 200 && data.data.length) {
        this.myaddress = data.data;
      }
    }, error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  getStoreList() {
    const info = [...new Set(this.cart.cart.map(item => item.store_id))];
    console.log('store iddss==================>>', info);
    // test
    // info.push(10, 17);
    // test
    const param = {
      id: info.join()
    };
    this.api.post('stores/getStoresData', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200 && data.data.length) {
        this.storeAddress = data.data;
        this.cart.stores = this.storeAddress;
      } else {
        this.util.errorMessage(this.util.translate('Something went wrong'));
        // this.back();
      }
    }, error => {
      console.log('error', error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch((error => {
      console.log('error', error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }));
  }


  add(product, index) {
    if (this.cart.cart[index].quantiy > 0) {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
      this.cart.addQuantity(this.cart.cart[index].quantiy, product.id);
    }
  }

  remove(product, index) {
    if (this.cart.cart[index].quantiy === 1) {
      this.cart.cart[index].quantiy = 0;
      this.cart.removeItem(product.id);
    } else {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy - 1;
      this.cart.addQuantity(this.cart.cart[index].quantiy, product.id);
    }
  }

  selectedOffers(item) {
    console.log(item);
    const min = parseFloat(item.min);
    if (this.cart.totalPrice >= min) {
      this.cart.coupon = item;
      this.offerName = item.name;
      this.cart.calcuate();
      console.log(this.cart.discount);
      this.offersModal.hide();
    } else {
      console.log('not valid with minimum amout', min);
      this.util.errorMessage(this.util.translate('Sorry') + ' ' + this.util.translate('minimum cart value must be')
        + ' ' + min + ' ' + this.util.translate('or equal'));
    }
  }

  getTime(time) {
    return moment(time).format('LLLL');
  }

  removeOffers() {
    this.cart.coupon = null;
    this.offerName = '';
    this.cart.discount = 0;
    this.cart.calcuate();
  }

  applyOffers() {
    this.cart.coupon = undefined;
    if (this.offerName) {
      const entered = this.offers.filter(x => x.name === this.offerName);
      if (entered && entered.length > 0) {
        const min = parseFloat(entered[0].min);
        if (this.cart.totalPrice >= min) {
          this.cart.coupon = entered[0];
          this.cart.calcuate();
          console.log(this.cart.discount);
          this.util.suucessMessage(this.util.translate('counpon applied'));
        } else {
          console.log('not valid with minimum amout', min);
          this.util.errorMessage(this.util.translate('Sorry') + ' ' + this.util.translate('minimum cart value must be')
            + ' ' + min + ' ' + this.util.translate('or equal'));
        }
      } else {
        this.util.errorMessage(this.util.translate('Offer not found'));
      }
    }
  }

  addNewAddress() {
    ///
    // this.newAddress.show();
    this.editClicked = false;
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position);
          this.addressSelected = false;
          this.addressFromMap.show();
          this.getAddressFromMaps(position.coords.latitude, position.coords.longitude);
        },
        error => {
          switch (error.code) {
            case 1:
              console.log('Permission Denied');
              this.util.errorMessage(this.util.translate('Location Permission Denied'));
              break;
            case 2:
              console.log('Position Unavailable');
              this.util.errorMessage(this.util.translate('Position Unavailable'));
              break;
            case 3:
              console.log('Timeout');
              this.util.errorMessage(this.util.translate('Failed to fetch location'));
              break;
          }
        }
      );
    };
  }

  getAddressFromMaps(lat, lng) {
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'location': location }, (results, status) => {
      console.log(results);
      console.log('status', status);
      if (results && results.length) {
        this.address = results[0].formatted_address;
        this.cd.detectChanges();
        this.loadMap(lat, lng);

      }
    });
  }

  loadMap(lat, lng) {
    const location = new google.maps.LatLng(lat, lng);
    const style = [
      {
        featureType: 'all',
        elementType: 'all',
        stylers: [
          { saturation: -100 }
        ]
      }
    ];

    const mapOptions = {
      zoom: 16,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: false,
      overviewMapControl: false,
      center: location,
      mapTypeControl: false,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'Foodies by initappz']
      }
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    const mapType = new google.maps.StyledMapType(style, { name: 'Grayscale' });
    this.map.mapTypes.set('Foodies by initappz', mapType);
    this.map.setMapTypeId('Foodies by initappz');
    this.cd.detectChanges();
    this.addMarker(location);
  }

  addMarker(location) {
    const dot = {
      url: 'assets/map-marker.png',
      scaledSize: new google.maps.Size(50, 50), // scaled size
    };
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: dot
    });
  }

  changeAddress() {
    this.addressFromMap.hide();
    this.changedPlace.show();
  }

  deleteAddress(item) {
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('to delete this address'),
      icon: 'question',
      confirmButtonText: this.util.translate('Yes'),
      backdrop: false,
      background: 'white',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: this.util.translate('cancel')
    }).then(data => {
      console.log(data);
      if (data && data.value) {
        this.util.start();
        const param = {
          id: item.id
        };
        this.api.post('address/deleteList', param).then(info => {
          console.log(info);
          this.util.stop();
          this.getAddress();
        }, error => {
          console.log(error);
          this.util.stop();
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }).catch((error) => {
          console.log(error);
          this.util.stop();
          this.util.errorMessage(this.util.translate('Something went wrong'));
        });
      }
    });
  }

  chooseFromMaps() {
    // console.log(this.mapElement);
    this.addressSelected = true;
    document.getElementById('map').style.height = '150px';
  }

  addAddress() {
    this.addressFromMap.hide();
    if (this.address === '' || this.landmark === '' || this.house === '' || this.pincode === '') {
      this.util.errorMessage(this.util.translate('All Fields are required'));
      return false;
    }
    const geocoder = new google.maps.Geocoder;
    this.util.start();
    geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
      console.log(results, status);
      if (status === 'OK' && results && results.length) {
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        console.log('----->', this.lat, this.lng);
        console.log('call api');
        const param = {
          uid: localStorage.getItem('uid'),
          address: this.address,
          lat: this.lat,
          lng: this.lng,
          title: this.title,
          house: this.house,
          landmark: this.landmark,
          pincode: this.pincode
        };

        this.api.post('address/save', param).then((data: any) => {
          this.util.stop();
          if (data && data.status === 200) {
            // this.navCtrl.back();
            this.getAddress();
            // this.util.showToast('Address added', 'success', 'bottom');
            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              }
            });

            Toast.fire({
              icon: 'success',
              title: this.util.translate('Address added')
            });
          } else {
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.stop();
          this.util.errorMessage(this.util.translate('Something went wrong'));
        });
      } else {
        this.util.stop();
        this.util.errorMessage(this.util.translate('Something went wrong'));
        return false;
      }
    });
  }

  editAddress(item) {
    console.log(item);
    this.editClicked = true;
    this.address = item.address;
    this.lat = item.lat;
    this.lng = item.lng;
    this.pincode = item.pincode;
    this.landmark = item.landmark;
    this.house = item.house;
    this.title = item.title;
    this.address_id = item.id;
    this.addressFromMap.show();
    this.getAddressFromMaps(this.lat, this.lng);
    this.chooseFromMaps();
  }

  editMyAddress() {
    this.addressFromMap.hide();
    if (this.address === '' || this.landmark === '' || this.house === '' || !this.pincode || this.pincode === '') {
      this.util.errorMessage(this.util.translate('All Fields are required'));
      return false;
    }
    const geocoder = new google.maps.Geocoder;
    this.util.start();
    geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
      console.log(results, status);
      if (status === 'OK' && results && results.length) {
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        console.log('----->', this.lat, this.lng);
        const param = {
          id: this.address_id,
          uid: localStorage.getItem('uid'),
          address: this.address,
          lat: this.lat,
          lng: this.lng,
          title: this.title,
          house: this.house,
          landmark: this.landmark,
          pincode: this.pincode
        };

        this.api.post('address/editList', param).then((data: any) => {
          this.util.stop();
          this.cd.detectChanges();
          if (data && data.status === 200) {
            this.getAddress();
            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              }
            });

            Toast.fire({
              icon: 'success',
              title: this.util.translate('Address updated')
            });
          } else {
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.stop();
          this.util.errorMessage(this.util.translate('Something went wrong'));
        });
      } else {
        this.util.stop();
        this.util.errorMessage(this.util.translate('Something went wrong'));
        return false;
      }
    });
  }

  onSearchChange(event) {
    console.log(event);
    if (this.query === '') {
      this.autocompleteItems1 = [];
      return;
    }
    const addsSelected = localStorage.getItem('addsSelected');
    if (addsSelected && addsSelected != null) {
      localStorage.removeItem('addsSelected');
      return;
    }

    this.GoogleAutocomplete.getPlacePredictions({ input: this.query }, (predictions, status) => {
      console.log(predictions);
      if (predictions && predictions.length > 0) {
        this.autocompleteItems1 = predictions;
        console.log(this.autocompleteItems1);
      }
    });
  }

  selectSearchResult1(item) {
    console.log('select', item);
    localStorage.setItem('addsSelected', 'true');
    this.autocompleteItems1 = [];
    this.query = item.description;
    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        console.log(status);
        this.address = this.query;
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        this.changedPlace.hide();
        this.addressFromMap.show();
        this.cd.detectChanges();
        this.loadMap(this.lat, this.lng);
      }
    });
  }

  async selectAddress(item) {
    this.cart.deliveryAddress = item;
    this.selectedAddress = item.id;
    this.cart.calcuate();
  }

  onSelect(data) {
    if (data === 'today') {
      this.datetime = 'today';
      this.time = this.util.translate('Today - ') + moment().format('dddd, MMMM Do YYYY');
    } else {
      this.datetime = 'tomorrow';
      this.time = this.util.translate('Tomorrow - ') + moment().add(1, 'days').format('dddd, MMMM Do YYYY');
    }
  }

  getString() {
    return 'Please visit this stores for your grocery , you can find this address in order details as well, if you found more than one address in list then, you have to visit every stores for your grocery';
  }

  next() {
    console.log('next', this.tabID, this.deliveryOption);
    console.log('deliveryadddress', this.selectedAddress);
    this.cart.deliveryAt = this.deliveryOption;
    this.cart.datetime = this.datetime;
    if (this.tabID === 1 && this.deliveryOption === 'home') {
      this.getAddress();
      this.tabID = 2;
    } else if (this.tabID === 1 && this.deliveryOption === 'store') {
      this.tabID = 3;
    } else if (this.tabID === 2 && this.selectedAddress) {
      const selecte = this.myaddress.filter(x => x.id === this.selectedAddress);
      const item = selecte[0];
      console.log('item', item);
      this.cart.deliveryAddress = item;
      this.tabID = 3;
    } else if (!this.selectedAddress) {
      this.util.errorMessage(this.util.translate('Please select address'));
    }
    this.smoothScrollTop();
    this.cart.calcuate();
  }

  prev() {
    console.log('prev', this.tabID);
    if (this.tabID === 2) {
      this.tabID = 1;
    } else if (this.tabID === 3 && this.deliveryOption === 'home') {
      this.tabID = 2;
    } else {
      this.tabID = 1;
    }
    this.smoothScrollTop();
  }

  payMethod(method) {
    console.log(method);
    this.payMethods = method;
  }

  proceed() {
    console.log(this.payMethods);
    if (this.payMethods && this.payMethods !== '') {
      if (this.payMethods === 'cod') {
        this.createOrder(this.payMethods, 'none');
      } else if (this.payMethods === 'stripe') {
        console.log('pay with stripe');
        this.frame.show();
      } else if (this.payMethods === 'razor') {
        this.razorPayConfig();
      } else if (this.payMethods === 'paytm') {
        this.payTm();
      } else if (this.payMethods === 'instamojo') {
        this.instaPay();
      } else if (this.payMethods === 'paystacks') {
        this.paystackPay();
      } else if (this.payMethods === 'flutterPay') {
        this.flutterPay();
      }
    }
  }


  payWithCard() {
    console.log(this.token);
    if (this.token) {
      const options = {
        amount: Math.ceil(this.cart.grandTotal * 100),
        currency: this.util.stripeCode,
        customer: this.util.userInfo.stripe_key,
        card: this.token,
      };
      console.log('options', options);
      const url = 'https://api.stripe.com/v1/charges';
      this.util.start();
      this.api.externalPost(url, options, this.util.stripe).subscribe((data: any) => {
        console.log('------------------------->', data);
        this.payId = data.id;
        this.util.stop();
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });

        Toast.fire({
          icon: 'success',
          title: this.util.translate('Payment Success')
        });
        this.createOrder('stripe', this.payId);
      }, (error) => {
        this.util.stop();
        console.log(error);
        if (error && error.error && error.error.error && error.error.error.message) {
          this.util.errorMessage(error.error.error.message);
          return false;
        }
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
    } else {
      this.util.errorMessage(this.util.translate('Please select card'));
    }
  }

  addcard() {
    console.log('userinfo-=-.>>', this.util.userInfo);
    this.date = this.date.replace(/ /g, '');
    this.cnumber = this.cnumber.replace(/ /g, '');
    console.log('date============>', this.date.split('/'));
    console.log('cumner', this.cnumber);
    if (this.email === '' || this.cname === '' || this.cnumber === '' ||
      this.cvc === '' || this.date === '') {
      this.util.errorMessage(this.util.translate('All Fields are required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(this.email))) {
      this.util.errorMessage(this.util.translate('Please enter valid email'));

      return false;
    }
    const year = this.date.split('/')[1];
    const month = this.date.split('/')[0];
    if (this.util.userInfo && this.util.userInfo.stripe_key && this.util.userInfo.stripe_key !== '') {
      // add card op existing customer...
      console.log('add new card');
      const param = {
        'card[number]': this.cnumber,
        'card[exp_month]': month,
        'card[exp_year]': year,
        'card[cvc]': this.cvc
      };
      this.util.start();
      this.api.externalPost('https://api.stripe.com/v1/tokens', param, this.util.stripe).subscribe((data: any) => {
        console.log(data);
        if (data && data.id) {
          // this.token = data.id;
          const newCardInfo = {
            source: data.id
          };
          this.api.externalPost('https://api.stripe.com/v1/customers/' + this.util.userInfo.stripe_key + '/sources',
            newCardInfo, this.util.stripe).subscribe((data) => {
              console.log('new card addedd', data);
              this.addCard = false;
              this.util.stop();
              this.getCards();
            }, error => {
              console.log('error in new card', error);
              this.util.stop();
            });
        } else {
          this.util.stop();
        }
      }, (error: any) => {
        console.log(error);
        this.util.stop();
        console.log();
        if (error && error.error && error.error.error && error.error.error.message) {
          // this.util.showErrorAlert(error.error.error.message);
          this.util.errorMessage(error.error.error.message);
          return false;
        }
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });

    } else {
      /// create new customer.... and add new card
      const param = {
        'card[number]': this.cnumber,
        'card[exp_month]': month,
        'card[exp_year]': year,
        'card[cvc]': this.cvc
      };
      this.util.start();
      this.api.externalPost('https://api.stripe.com/v1/tokens', param, this.util.stripe).subscribe((data: any) => {
        console.log(data);
        if (data && data.id) {
          // this.token = data.id;
          const customer = {
            description: 'Customer for groceryee app',
            source: data.id,
            email: this.email
          };
          this.api.externalPost('https://api.stripe.com/v1/customers', customer, this.util.stripe).subscribe((customer: any) => {
            console.log(customer);
            this.util.stop();
            if (customer && customer.id) {
              // this.cid = customer.id;
              const cid = {
                id: localStorage.getItem('uid'),
                stripe_key: customer.id
              };

              this.updateUser(cid);
            }
          }, error => {
            this.util.stop();
            console.log();
            if (error && error.error && error.error.error && error.error.error.message) {
              // this.util.showErrorAlert(error.error.error.message);
              this.util.errorMessage(error.error.error.message);
              return false;
            }
            this.util.errorMessage(this.util.translate('Something went wrong'));
          });
        } else {
          this.util.stop();
        }
      }, (error: any) => {
        console.log(error);
        this.util.stop();
        console.log();
        if (error && error.error && error.error.error && error.error.error.message) {
          // this.util.showErrorAlert(error.error.error.message);
          this.util.errorMessage(error.error.error.message);
          return false;
        }
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
    }
  }

  updateUser(param) {
    this.util.start();
    this.api.post('users/edit_profile', param).then((data: any) => {
      this.util.stop();
      console.log(data);
      const getParam = {
        id: localStorage.getItem('uid')
      };
      this.api.post('users/getById', getParam).then((data: any) => {
        console.log('user info=>', data);
        if (data && data.status === 200 && data.data && data.data.length) {
          this.util.userInfo = data.data[0];
          // this.navCtrl.back();
        } else {
          // this.navCtrl.back();
        }
        this.addCard = false;
        this.getCards();
      }, error => {
        console.log(error);
      });
    }, error => {
      this.util.stop();
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }
}
