/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { OptionService } from 'src/app/services/option.service';
import { AuthService } from 'src/app/services/auth.service';
import { TimeComponent } from 'src/app/components/time/time.component';
import { GmapService } from 'src/app/services/gmap.service';
import { StoreService } from 'src/app/services/store.service';
import { AddressService } from 'src/app/services/address.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  havePayment: boolean;
  haveStripe: boolean;
  havePayPal: boolean;
  haveCOD: boolean;
  haveGCash: boolean;
  havePaymongo: boolean;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    public cart: CartService,
    public util: UtilService,
    public api: ApiService,
    private iab: InAppBrowser,
    private popoverController: PopoverController,
    private optServ: OptionService,
    private authServ: AuthService,
    private gmapServ: GmapService,
    private storeServ: StoreService,
    private addressServ: AddressService,
    private orderServ: OrderService
  ) {
    this.util.getCouponObservable().subscribe((data) => {
      console.log(data);
      this.cart.calcuate();
      console.log(this.cart.discount);
    }, error => {
      console.log(error);
    });

    this.optServ.request((response) => {
      this.havePayment = true;
      let payment_method = this.optServ.current.payment;
      this.haveCOD = payment_method.cod_enable == '1' ? true : true;
      this.havePayPal = payment_method.paypal_enable == '1' ? true : false;
      this.haveStripe = payment_method.stripe_enable == '1' ? true : false;
      this.haveGCash = payment_method.gcash_enable == '1' ? true : false;
      this.havePaymongo = payment_method.paymongo_enable == '1' ? true : false;
    })    

    this.getStoreList();
    this.datetime = 'today';
    this.time = this.util.getString('Today - ') + moment().format('dddd, MMMM Do YYYY');
    this.curTime = moment().format('YYYY-MM-DD HH:mm:ss'); 
  }

  deliveryOption: any = 'home';

  storeAddress: any[] = [];
  time: any;
  datetime: any;

  getStoreList() {
    const info = [...new Set(this.cart.cart.map(item => item.store_id))];
    
    this.api.post('galyon/v1/stores/getStoreByIds', {
      uuids: info.join()
    }).subscribe((response: any) => {
      if (response && response.success && response.data) {
        this.storeAddress = response.data;
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  chooseAddress() {
    if(!this.authServ.is_authenticated) {
      this.router.navigate(['login'])
      return;
    }
    const param: NavigationExtras = {
      queryParams: {
        from: 'payment'
      }
    };
    //this.cart.calcuate(); //TODO: Move to Cart Page
    this.router.navigate(['user/cart/address'], param)
  }

  curTime: any;
  async openTime(ev) {
    const popover = await this.popoverController.create({
      component: TimeComponent,
      event: ev,
      mode: 'ios',
    });
    popover.onDidDismiss().then(data => {
      console.log(data.data);
      if (data.data) {
        if (data.data === 'today') {
          this.datetime = 'today';
          this.time = this.util.getString('Today - ') + moment().format('dddd, MMMM Do YYYY');
          this.curTime = moment().format('YYYY-MM-DD HH:mm:ss');
        } else {
          this.datetime = 'tomorrow';
          this.time = this.util.getString('Tomorrow - ') + moment().add(1, 'days').format('dddd, MMMM Do YYYY');
          this.curTime = moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
        }
      }
    });
    await popover.present();
  }

  async createOrder(method = 'cod') {

    if(!this.cart.deliveryAddress && this.deliveryOption == "home") {
      this.util.errorToast(this.util.getString('Please set the delivery address!'));
      return;
    }

    const store_ids = [...new Set(this.cart.cart.map(item => item.store_id))];

    store_ids.forEach(async(store_id) => {

      //Prepare data
      let orderPackage = {
        uid: this.authServ.userToken.uuid,
        address_id: null,
        store_id: store_id,
        
        items: JSON.stringify(this.cart.getOrderItemObject()), //Minimize
        //progress: [], //TODO: Should be done in the server.
        matrix: null,
        factor: null,
        coupon: this.cart.coupon ? JSON.stringify(this.cart.getCouponObjectForOrder()) : '',

        // total: this.cart.totalPrice, //Check
        // discount: this.cart.discount, //Check
        // tax: this.cart.orderTaxAmt, //Check
        // delivery: this.cart.deliveryPrice, //Check
        // grand_total: this.cart.grandTotal, //Check
        paid_method: method,
      }

      let factor = {
        schedule: this.curTime,
        distance: 0,
        tax: this.optServ.current.general.tax,
        ship_mode: this.optServ.current.general.shipping,
        ship_price: this.optServ.current.general.shippingPrice,
        min_order: this.optServ.current.general.minimum_order,
        free_delivery: this.optServ.current.general.free_delivery,
        currency_code: this.optServ.current.settings.currency_code
      };

      let matrix: any;

      //Add delievery details if posible.
      if(this.cart.deliveryAddress) {
        orderPackage.address_id = this.cart.deliveryAddress.uuid;

        let origin = {
          lat: parseFloat(this.cart.deliveryAddress.lat), 
          lng: parseFloat(this.cart.deliveryAddress.lng)
        };
        let destination = {
          lat: origin.lat, 
          lng: origin.lng
        };

        let store_address: any = await this.addressServ.getByStore(store_id);
        if(!store_address) {
          this.util.errorToast(this.util.getString('One store dont have a valid address.'));
          return;
        }

        destination.lat = parseFloat(store_address[0].lat);
        destination.lng = parseFloat(store_address[0].lng);
        matrix = await this.gmapServ.calculateDistance(origin, [destination]);
        if(matrix) {
          factor.distance = matrix.distances[0][0].distance.value;
        }
      }
      orderPackage.factor = JSON.stringify(factor);
      orderPackage.matrix = JSON.stringify(matrix);

      let orderStatus = await this.orderServ.submitOrder(orderPackage);
      if(!orderStatus) {
        this.util.errorToast(this.util.getString('Order not accepted by one of the store.'));
        return;
      }
    });

    //this.api.createOrderNotification(this.cart.stores);
    this.cart.clearCart();
    //this.util.publishNewOrder();
    this.navCtrl.navigateRoot(['user/orders'], { replaceUrl: true, skipLocationChange: true });
  }

  async makeOrder(method, key) {
    const storeId = [...new Set(this.cart.cart.map(item => item.store_id))];
    const orderStatus = [];
    storeId.forEach(element => {
      const info = {
        id: element,
        status: 'created'
      }
      orderStatus.push(info)
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
      paid_method: method,
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
      pay_key: key,
      status: JSON.stringify(orderStatus),
      assignee: '',
      extra: JSON.stringify(this.cart.userOrderTaxByStores)
    }

    this.util.show();
    this.api.post('orders/save', param).subscribe((data: any) => {
      console.log(data);
      this.util.hide();
      //this.api.createOrderNotification(this.cart.stores);
      this.cart.clearCart();
      this.util.publishNewOrder();
      this.navCtrl.navigateRoot(['/orders'], { replaceUrl: true, skipLocationChange: true });
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
    });
  }

  ngOnInit() {
  }

  back() {
    this.navCtrl.navigateBack(['user/cart']);
  }

  openCoupon() {
    this.router.navigate(['user/cart/offers']);
  }

  getTime(time) {
    // const date = moment().format('DD-MM-YYYY');
    // return moment(date + ' ' + time).format('hh:mm a');
    return moment(time, ['h:mm A']).format('hh:mm A');
  }

  paypalPayment() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const param = {
      uid: localStorage.getItem('uid'),
      itemName: 'galyon',
      grandTotal: this.cart.grandTotal,
      dateTime: moment().format('YYYY-MM-DD HH:mm'),
      logo: this.api.mediaURL + this.util.logo
    }
    console.log('to url===>', this.api.JSON_to_URLEncoded(param))
    const url = this.api.baseUrl + 'paypal/buyProduct?' + this.api.JSON_to_URLEncoded(param);
    const browser: any = this.iab.create(url, '_blank', options);
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success') || navUrl.includes('checkout/done')) {
        console.log('close');
        browser.close();
        this.makeOrder('paypal', 'fromApp');
      }
    });
  }

  openStripe() {
    this.router.navigate(['user/cart/stripe-payments']);
  }

  getName() {
    return this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name + ' ' + this.util.userInfo.last_name : 'Galyon';
  }

  getEmail() {
    return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'support@galyon.app';
  }

  cardInfo(val) {

  }

  goToSucess() {
    this.router.navigate(['/success']);
  }









  // getPayments() {
  //   this.util.show();
  //   this.api.get('payments').subscribe((data: any) => {
  //     console.log(data);
  //     this.util.hide();
  //     if (data && data.status === 200 && data.data) {
  //       const info = data.data.filter(x => x.status === '1');
  //       if (info && info.length > 0) {
  //         this.havePayment = true;
          
  //         const cod = info.filter(x => x.id === '2');
  //         this.haveCOD = cod && cod.length > 0 ? true : false;
  //         const payPal = info.filter(x => x.id === '3');
  //         this.havePayPal = payPal && payPal.length > 0 ? true : false;
  //         const stripe = info.filter(x => x.id === '1');
  //         this.haveStripe = stripe && stripe.length > 0 ? true : false;


  //         const razor = info.filter(x => x.id === '4');
  //         this.haveRazor = razor && razor.length > 0 ? true : false;
  //         const paytm = info.filter(x => x.id === '5');
  //         this.havePayTM = paytm && paytm.length > 0 ? true : false;
  //         const insta = info.filter(x => x.id === '6');
  //         this.haveInstamojo = insta && insta.length > 0 ? true : false;
  //         const paystack = info.filter(x => x.id === '7');
  //         this.havepayStack = paystack && paystack.length > 0 ? true : false;
  //         const flutterwave = info.filter(x => x.id === '8');
  //         this.haveflutterwave = flutterwave && flutterwave.length > 0 ? true : false;
  //         if (this.haveStripe) {
  //           // this.util.stripe = stripe;
  //           if (stripe) {
  //             const creds = JSON.parse(stripe[0].creds);
  //             if (stripe[0].env === '1') {
  //               this.util.stripe = creds.live;
  //             } else {
  //               this.util.stripe = creds.test;
  //             }
  //             this.util.stripeCode = creds && creds.code ? creds.code : 'USD';
  //           }
  //           console.log('============>>', this.util.stripe);
  //         }
  //         if (this.haveInstamojo) {
  //           const datas = info.filter(x => x.id === '6');
  //           this.instaENV = datas[0].env;
  //           if (insta) {
  //             const instaPay = JSON.parse(datas[0].creds);
  //             this.instamojo = instaPay;
  //             console.log('instaMOJO', this.instamojo);
  //           }
  //         }
  //         if (this.haveRazor) {
  //           const razorPay = info.filter(x => x.id === '4');
  //           const env = razorPay[0].env;
  //           if (razorPay) {
  //             const keys = JSON.parse(razorPay[0].creds);
  //             console.log('evnof razor pay', env);
  //             this.razorKey = env === '0' ? keys.test : keys.live;
  //             console.log('----------', this.razorKey);
  //           }
  //         }
  //         if (this.havepayStack) {
  //           const keys = JSON.parse(paystack[0].creds);
  //           this.paystack = keys;
  //           console.log('paystack variables', this.paystack);
  //         }

  //         if (this.haveflutterwave) {
  //           const keys = JSON.parse(flutterwave[0].creds);
  //           this.flutterwave = keys;
  //           console.log('flutterwave config', this.flutterwave);
  //         }
  //       } else {
  //         this.havePayment = false;
  //         this.util.showToast(this.util.getString('No Payment Found'), 'danger', 'bottom');
  //       }
  //     } else {
  //       this.havePayment = false;
  //       this.util.showToast(this.util.getString('No Payment Found'), 'danger', 'bottom');
  //     }
  //   }, error => {
  //     console.log(error);
  //     this.util.hide();
  //     this.havePayment = false;
  //     this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
  //   });
  // }

  // proceed() {
  //   // this.util.errorToast('ongoing');
  //   const options: InAppBrowserOptions = {
  //     location: 'no',
  //     clearcache: 'yes',
  //     zoom: 'yes',
  //     toolbar: 'yes',
  //     closebuttoncaption: 'close'
  //   };
  //   const param = {
  //     key: this.razorKey,
  //     amount: this.cart.grandTotal ? this.cart.grandTotal * 100 : 5,
  //     email: this.getEmail(),
  //     logo: this.api.mediaURL + this.util.logo
  //   }
  //   console.log('to url===>', this.api.JSON_to_URLEncoded(param))
  //   const url = this.api.baseUrl + 'razorpay?' + this.api.JSON_to_URLEncoded(param);
  //   const browser: any = this.iab.create(url, '_blank', options);
  //   browser.on('loadstop').subscribe(event => {
  //     console.log('event?;>11', event);
  //     const navUrl = event.url;
  //     if (navUrl.includes('success')) {
  //       console.log('close');
  //       browser.close();
  //       const urlItems = new URL(event.url);
  //       const orderId = urlItems.searchParams.get('id');
  //       this.makeOrder('razorpay', orderId);
  //     }
  //   });
  // }

  // flutterpay() {
  //   const options: InAppBrowserOptions = {
  //     location: 'no',
  //     clearcache: 'yes',
  //     zoom: 'yes',
  //     toolbar: 'yes',
  //     closebuttoncaption: 'close'
  //   };
  //   const param = {
  //     key: this.flutterwave.pk,
  //     amount: this.cart.grandTotal,
  //     email: this.getEmail(),
  //     phone: this.util.userInfo.mobile,
  //     name: this.getName(),
  //     code: this.flutterwave.code,
  //     logo: this.api.mediaURL + this.util.logo
  //   }
  //   console.log('to url===>', this.api.JSON_to_URLEncoded(param))
  //   const url = this.api.baseUrl + 'flutterwave?' + this.api.JSON_to_URLEncoded(param);
  //   const browser: any = this.iab.create(url, '_blank', options);
  //   browser.on('loadstop').subscribe(event => {
  //     console.log('event?;>11', event);
  //     const navUrl = event.url;
  //     if (navUrl.includes('success') || navUrl.includes('closed')) {
  //       console.log('close');
  //       browser.close();
  //       if (navUrl.includes('success')) {
  //         const urlItems = new URL(event.url);
  //         const orderId = urlItems.searchParams.get('transaction_id');
  //         this.makeOrder('flutterwave', orderId);
  //       }

  //     }
  //   });
  // }

  // paystackPay() {
  //   const options: InAppBrowserOptions = {
  //     location: 'no',
  //     clearcache: 'yes',
  //     zoom: 'yes',
  //     toolbar: 'yes',
  //     closebuttoncaption: 'close'
  //   };
  //   const paykey = '' + Math.floor((Math.random() * 1000000000) + 1);
  //   const param = {
  //     key: this.paystack.pk,
  //     email: this.util.userInfo.email,
  //     amount: this.cart.grandTotal * 100,
  //     firstname: this.util.userInfo.first_name,
  //     lastname: this.util.userInfo.last_name,
  //     ref: paykey
  //   }
  //   console.log('to url===>', this.api.JSON_to_URLEncoded(param))
  //   const url = this.api.baseUrl + 'paystack?' + this.api.JSON_to_URLEncoded(param);
  //   const browser: any = this.iab.create(url, '_blank', options);
  //   browser.on('loadstop').subscribe(event => {
  //     console.log('event?;>11', event);
  //     const navUrl = event.url;
  //     if (navUrl.includes('success') || navUrl.includes('close')) {
  //       console.log('close');
  //       browser.close();
  //       if (navUrl.includes('success')) {
  //         console.log('closed---->>>>>')
  //         this.makeOrder('paystack', paykey);
  //       } else {
  //         console.log('closed');
  //       }
  //     }
  //   });
  // }

  // paytm() {
  //   const options: InAppBrowserOptions = {
  //     location: 'no',
  //     clearcache: 'yes',
  //     zoom: 'yes',
  //     toolbar: 'yes',
  //     closebuttoncaption: 'close'
  //   };
  //   const orderId = this.util.makeid(20);
  //   const param = {
  //     ORDER_ID: orderId,
  //     CUST_ID: localStorage.getItem('uid'),
  //     INDUSTRY_TYPE_ID: 'Retail',
  //     CHANNEL_ID: 'WAP',
  //     TXN_AMOUNT: this.cart.grandTotal ? this.cart.grandTotal : 5
  //   }
  //   console.log('to url===>', this.api.JSON_to_URLEncoded(param))
  //   const url = this.api.baseUrl + 'paytm/pay?' + this.api.JSON_to_URLEncoded(param);
  //   const browser: any = this.iab.create(url, '_blank', options);
  //   browser.on('loadstop').subscribe(event => {
  //     console.log('event?;>11', event);
  //     const navUrl = event.url;
  //     if (navUrl.includes('success')) {
  //       console.log('close');
  //       browser.close();
  //       this.makeOrder('paytm', orderId);
  //     }
  //   });
  // }

  // instaPay() {
  //   let url;
  //   if (this.instaENV === '0') {
  //     url = 'https://test.instamojo.com/api/1.1/payment-requests/'
  //   } else {
  //     url = 'https://www.instamojo.com/api/1.1/payment-requests/';
  //   };

  //   const param = {
  //     allow_repeated_payments: 'False',
  //     amount: this.cart.grandTotal,
  //     buyer_name: this.getName(),
  //     purpose: 'Galyon order',
  //     redirect_url: this.api.baseUrl + 'paypal/success',
  //     phone: this.util.userInfo && this.util.userInfo.mobile ? this.util.userInfo.mobile : '',
  //     send_email: 'True',
  //     webhook: this.api.baseUrl,
  //     send_sms: 'True',
  //     email: this.getEmail()
  //   };

  //   this.util.show();
  //   this.api.instaPay(url, param, this.instamojo.key, this.instamojo.token).then((data: any) => {
  //     console.log(data);
  //     this.util.hide();
  //     console.log(JSON.parse(data.data));
  //     const info = JSON.parse(data.data);
  //     console.log('data.status', data.status);
  //     if (data.status === 201 && info && info.success === true) {
  //       const options: InAppBrowserOptions = {
  //         location: 'no',
  //         clearcache: 'yes',
  //         zoom: 'yes',
  //         toolbar: 'yes',
  //         closebuttoncaption: 'close'
  //       };
  //       const browser: any = this.iab.create(info.payment_request.longurl, '_blank', options);
  //       browser.on('loadstop').subscribe(event => {
  //         const navUrl = event.url;
  //         console.log('navURL', navUrl);
  //         if (navUrl.includes('success')) {
  //           browser.close();
  //           const urlItems = new URL(event.url);
  //           console.log(urlItems);
  //           const orderId = urlItems.searchParams.get('payment_id');
  //           this.makeOrder('instamojo', orderId);
  //         }
  //       });
  //     } else {
  //       const error = JSON.parse(data.error);
  //       console.log('error message', error);
  //       if (error && error.message) {
  //         this.util.showToast(error.message, 'danger', 'bottom');
  //         return false;
  //       }
  //       this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
  //     }
  //   }, error => {
  //     console.log(error);
  //     this.util.hide();
  //     const message = JSON.parse(error.error);
  //     console.log('error message', message);
  //     if (message && message.message) {
  //       this.util.showToast(message.message, 'danger', 'bottom');
  //       return false;
  //     }
  //     this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
  //   }).catch(error => {
  //     console.log(error);
  //     this.util.hide();
  //     const message = JSON.parse(error.error);
  //     console.log('error message', message);
  //     if (message && message.message) {
  //       this.util.showToast(message.message, 'danger', 'bottom');
  //       return false;
  //     }
  //     this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
  //   })
  // }
}

