/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, ViewChild, HostListener, ChangeDetectorRef, ElementRef } from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  NavigationExtras
} from '@angular/router';
import { ToasterConfig } from 'angular2-toaster';
import { ApiService } from './services/api.service';
import { UtilService } from './services/util.service';
import { CartService } from './services/cart.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { Title } from '@angular/platform-browser';
import { login } from './interfaces/login';
import { mobile } from './interfaces/mobile';
import { mobileLogin } from './interfaces/mobileLogin';
import { register } from './interfaces/register';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('cartModel') public cartModel: ModalDirective;
  @ViewChild('verifyModal') public verifyModal: ModalDirective;
  @ViewChild('registerModal') public registerModal: ModalDirective;
  @ViewChild('loginModal') public loginModal: ModalDirective;
  @ViewChild('otpModal') public otpModal: ModalDirective;
  @ViewChild('forgotPwd') public forgotPwd: ModalDirective;
  @ViewChild('topScrollAnchor') topScroll: ElementRef;
  @ViewChild('basicModal') public basicModal: ModalDirective;
  @ViewChild('scrollMe') private scrollMe: ElementRef;
  title = 'groceryee';
  loaded: boolean;
  deviceType = 'desktop';
  innerHeight: string;
  windowWidth: number;

  verticalNavType = 'expanded';
  verticalEffect = 'shrink';
  isShow: boolean;
  topPosToStartShowing = 100;
  loading = true;
  login: login = { email: '', password: '' };
  mobile: mobile = { ccCode: '91', phone: '', password: '' };
  mobileLogin: mobileLogin = { ccCode: '91', phone: '' };
  registerForm: register = {
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    gender: '1',
    mobile: '',
    fcm_token: '',
    type: '',
    lat: '',
    lng: '',
    cover: '',
    status: '',
    verified: '',
    others: '',
    date: '',
    stripe_key: '',
    cc: '91',
    check: false
  };

  submitted = false;
  ccCode: any;
  userCode: any = '';
  resendCode: boolean;
  otpId: any;
  uid: any;

  languageClicked: boolean = false;

  isLogin: boolean = false;

  div_type;
  sent: boolean;
  reset_email: any;
  reset_otp: any;
  reset_myOPT: any;
  reset_verified: any;
  reset_userid: any;
  reset_password: any;
  reset_repass: any;
  reset_loggedIn: boolean;
  reset_id: any;

  reset_phone: any;
  reset_cc: any = '91';

  public config: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: true,
      timeout: 2000,
      positionClass: 'toast-bottom-right'
    });

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    console.log('scrollposition', scrollPosition)
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  isPopState = false;
  router$: Subscription;


  name: any;
  msg: any = '';
  messages: any[] = [];
  uid_chat: any;
  id_chat: any;
  loaded_chat: boolean;
  yourMessage: boolean;
  interval: any;

  constructor(
    private router: Router,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private chmod: ChangeDetectorRef,
    private titleService: Title,
  ) {
    this.div_type = 1;
    const scrollHeight = window.screen.height - 150;
    this.innerHeight = scrollHeight + 'px';
    this.windowWidth = window.innerWidth;
    this.setMenuAttributs(this.windowWidth);
    this.util.subscribeCartBtn().subscribe((data) => {
      this.cartModel.show();
    });
    this.util.subscribeModalPopup().subscribe((data) => {
      console.log('data', data);
      if (data && data === 'login') {
        this.loginModal.show();
      } else if (data && data === 'register') {
        this.registerModal.show();
      }
    });
    this.loaded = false;
    this.initializeApp();
    this.util.getPriceOfCart().subscribe(() => {
      console.log('*************************************');
      // this.initializeApp();
      console.log('*************************************');
    });
    this.router.events.subscribe((e: RouterEvent) => {
      this.navigationInterceptor(e);
    });
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
      this.loaded = false;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
      this.loaded = true;
      // window.scrollTo(0, 0);
      window.scrollTo({ top: 0 });
      const data = this.getTitle(this.router.routerState, this.router.routerState.root);
      console.log('--->>navigation data', data);
      this.titleService.setTitle(data && data[0] ? this.util.translate(data[0]) + ' | Groceryee By initappz' :
        this.util.translate('Home') + ' | Groceryee By initappz');
    }

    if (event instanceof NavigationCancel) {
      this.loading = false;
      this.loaded = true;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
      this.loaded = true;
    }
  }

  getTitle(state, parent) {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  ngOnInit() {
    this.router$ = this.router.events.subscribe(next => this.onRouteUpdated(next));
  }

  ngOnDestroy() {
    if (this.router$ != null) {
      this.router$.unsubscribe();
    }
  }

  private onRouteUpdated(event: any): void {
    if (event instanceof NavigationEnd) {
      this.smoothScrollTop();
    }
  }

  private smoothScrollTop(): void {
    this.topScroll.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  onNavigate(event): any {

  }

  initializeApp() {
    this.api.get('cities').then((data: any) => {
      console.log(data);
      if (data && data.status === 200 && data.data && data.data.length) {
        const cities = data.data.filter(x => x.status === '1');
        const id = localStorage.getItem('city');
        if (id && id !== null && id !== 'null') {
        } else {
          localStorage.setItem('city', cities[0].id);
          this.util.publishCity('push');
        }
        this.chmod.detectChanges();
        const lng = localStorage.getItem('language');
        if (!lng || lng === null) {
          this.api.get('users/getDefaultSettings').then((data: any) => {
            console.log('----------------- app setting', data);
            if (data && data.status === 200 && data.data) {
              const manage = data.data.manage;
              const language = data.data.lang;
              const popup = data.data.popup;
              if (manage && manage.length > 0) {
                if (manage[0].app_close === 0 || manage[0].app_close === '0') {
                  this.util.appClosed = true;
                  this.util.appClosedMessage = manage[0].message;
                } else {
                  this.util.appClosed = false;
                }
              } else {
                this.util.appClosed = false;
              }
              if (popup && popup.length > 0) {
                if (popup[0].shown === 1 || popup[0].shown === '1') {
                  this.util.havepopup = true;
                  this.util.popupMessage = popup[0].message;
                  this.util.publishPopup();
                } else {
                  this.util.havepopup = false;
                }
              } else {
                this.util.havepopup = false;
              }
              if (language) {
                this.util.translations = language;
                localStorage.setItem('language', data.data.file);
                const trl = this.getTitle(this.router.routerState, this.router.routerState.root);
                this.titleService.setTitle(trl && trl[0] ? this.util.translate(trl[0]) + ' | Groceryee By initappz' :
                  this.util.translate('Home') + ' | Groceryee By initappz');
              }
              const settings = data.data.settings;
              if (settings && settings.length > 0) {
                const info = settings[0];
                this.util.direction = info.appDirection;
                this.util.cside = info.currencySide;
                this.util.currecny = info.currencySymbol;
                this.util.logo = info.logo;
                this.util.twillo = info.twillo;
                this.util.delivery = info.delivery;
                this.util.user_login = info.user_login;
                this.util.reset_pwd = info.reset_pwd;
                this.util.header_category = info.web_category;
                document.documentElement.dir = this.util.direction;
              } else {
                this.util.direction = 'ltr';
                this.util.cside = 'right';
                this.util.currecny = '$';
                document.documentElement.dir = this.util.direction;
              }
              const general = data.data.general;
              console.log('generalllll============================>', general);
              if (general && general.length > 0) {
                const info = general[0];
                this.util.general = info;
                this.cart.minOrderPrice = parseFloat(info.min);
                this.cart.shipping = info.shipping;
                this.cart.shippingPrice = parseFloat(info.shippingPrice);
                this.cart.orderTax = parseFloat(info.tax);
                this.cart.freeShipping = parseFloat(info.free);
                this.util.publishPriceOfCart();
              }
              this.getCart();
            } else {
              this.getCart();
            }

          }, error => {
            this.loaded = true;
            console.log('default settings', error);
          }).catch(error => {
            this.loaded = true;
            console.log('default settings', error);
          });
        } else {
          const param = {
            id: localStorage.getItem('language')
          };
          this.api.post('users/getDefaultSettingsById', param).then((data: any) => {
            console.log('----------------- app setting', data);
            if (data && data.status === 200 && data.data) {
              const manage = data.data.manage;
              const language = data.data.lang;
              const popup = data.data.popup;

              if (manage && manage.length > 0) {
                if (manage[0].app_close === 0 || manage[0].app_close === '0') {
                  this.util.appClosed = true;
                  this.util.appClosedMessage = manage[0].message;
                } else {
                  this.util.appClosed = false;
                }
              } else {
                this.util.appClosed = false;
              }
              console.log('*******************popup', popup);
              if (popup && popup.length > 0) {
                if (popup[0].shown === 1 || popup[0].shown === '1') {
                  this.util.havepopup = true;
                  this.util.popupMessage = popup[0].message;
                  console.log('publish poppupppupppp');
                  this.util.publishPopup();
                } else {
                  this.util.havepopup = false;
                }
              } else {
                this.util.havepopup = false;
              }
              if (language) {
                this.util.translations = language;
                const trl = this.getTitle(this.router.routerState, this.router.routerState.root);
                this.titleService.setTitle(trl && trl[0] ? this.util.translate(trl[0]) + ' | Groceryee By initappz' :
                  this.util.translate('Home') + ' | Groceryee By initappz');
              }
              const settings = data.data.settings;
              if (settings && settings.length > 0) {
                const info = settings[0];
                this.util.direction = info.appDirection;
                this.util.cside = info.currencySide;
                this.util.currecny = info.currencySymbol;
                this.util.logo = info.logo;
                this.util.twillo = info.twillo;
                this.util.delivery = info.delivery;
                this.util.user_login = info.user_login;
                this.util.reset_pwd = info.reset_pwd;
                this.util.header_category = info.web_category;
                document.documentElement.dir = this.util.direction;

              } else {
                this.util.direction = 'ltr';
                this.util.cside = 'right';
                this.util.currecny = '$';
                document.documentElement.dir = this.util.direction;
              }
              const general = data.data.general;
              console.log('generalllll============================>', general)
              if (general && general.length > 0) {
                const info = general[0];
                this.util.general = info;
                this.cart.minOrderPrice = parseFloat(info.min);
                this.cart.shipping = info.shipping;
                this.cart.shippingPrice = parseFloat(info.shippingPrice);
                this.cart.orderTax = parseFloat(info.tax);
                this.cart.freeShipping = parseFloat(info.free);
                this.util.publishPriceOfCart();
              }
              this.getCart();
            } else {
              this.getCart();
            }

          }, error => {
            console.log('default settings by id', error);
            this.util.appClosed = false;
            this.util.direction = 'ltr';
            this.util.cside = 'right';
            this.util.currecny = '$';
            document.documentElement.dir = this.util.direction;
            this.loaded = true;
          }).catch(error => {
            console.log('default settings by id', error);
            this.util.appClosed = false;
            this.util.direction = 'ltr';
            this.util.cside = 'right';
            this.util.currecny = '$';
            document.documentElement.dir = this.util.direction;
            this.loaded = true;
          });
        }
      } else {
        this.util.toast('error', this.util.translate('Error'), this.util.translate('No cities found'));
        this.loaded = true;
      }
    }, error => {
      console.log('error', error);
      this.loaded = true;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log('error', error);
      this.loaded = true;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });


    const uid = localStorage.getItem('uid');
    if (uid && uid !== null && uid !== 'null') {
      const param = {
        id: uid
      };
      this.api.post('users/getById', param).then((data: any) => {
        console.log('user info=>', data);
        if (data && data.status === 200 && data.data && data.data.length) {
          this.util.userInfo = data.data[0];
        }
      }, error => {
        console.log(error);
      }).catch(error => {
        console.log(error);
      });
    }
  }

  getCart() {
    this.loaded = true;
    this.util.getKeys('cart').then((data) => {
      if (data && data !== null && data !== 'null') {
        const cart = JSON.parse(data);
        console.log('cart===>>', cart);
        this.cart.cart = cart;
        this.cart.itemId = [];
        this.cart.cart.forEach(element => {
          this.cart.itemId.push(element.id);
        });
        console.log('cartitemss ----><>>>>', this.cart.cart);
        console.log('subitem=====>>>', this.cart.itemId);
        this.cart.calcuate();
      }
    });

  }

  onResize(event) {
    this.innerHeight = event.target.innerHeight + 'px';
    /* menu responsive */
    this.windowWidth = event.target.innerWidth;
    let reSizeFlag = true;
    if (this.deviceType === 'tablet' && this.windowWidth >= 768 && this.windowWidth <= 1024) {
      reSizeFlag = false;
    } else if (this.deviceType === 'mobile' && this.windowWidth < 768) {
      reSizeFlag = false;
    }
    this.util.deviceType = this.deviceType;
    console.log(this.util.deviceType);
    if (reSizeFlag) {
      this.setMenuAttributs(this.windowWidth);
    }
  }

  setMenuAttributs(windowWidth) {
    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.deviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'push';
    } else if (windowWidth < 768) {
      this.deviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'overlay';
    } else {
      this.deviceType = 'desktop';
      this.verticalNavType = 'expanded';
      this.verticalEffect = 'shrink';
    }
    this.util.deviceType = this.deviceType;

  }

  openLink(link) {
    this.router.navigate([link]);
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

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  checkout() {
    this.cartModel.hide();
    this.router.navigate(['checkout']);
  }
  // login system

  loginWithEmailPassword(form: NgForm, modal) {
    console.log('form', form, this.login);
    this.submitted = true;
    if (form.valid && this.login.email && this.login.password) {
      console.log('valid');
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.login.email)) {
        this.util.errorMessage(this.util.translate('Please enter valid email'));
        return false;
      }
      console.log('login');

      this.isLogin = true;
      this.api.post('users/login', this.login).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status === 200) {
          if (data && data.data && data.data.type === 'user') {
            if (data.data.status === '1') {
              localStorage.setItem('uid', data.data.id);
              this.util.userInfo = data.data;
              const fcm = localStorage.getItem('fcm');
              if (fcm && fcm !== null && fcm !== 'null') {
                const updateParam = {
                  id: data.data.id,
                  fcm_token: fcm
                };
                this.api.post('users/edit_profile', updateParam).then((data: any) => {
                  console.log('user info=>', data);
                }, error => {
                  console.log(error);
                });
              }

              const favParam = {
                id: data.data.id
              }
              this.api.post('favourite/getByUid', favParam).then((data: any) => {
                console.log('fav data', data);
                if (data && data.status === 200 && data.data.length > 0) {
                  this.util.haveFav = true;
                  try {
                    this.util.favIds = data.data[0].ids.split(',');
                  } catch (error) {
                    console.log('eroor', error);
                  }
                } else {
                  this.util.haveFav = false;
                }
              }, error => {
                this.util.haveFav = false;
                console.log('fav error', error);
              });
              modal.hide();
            } else {
              console.log('not valid');
              modal.hide();
              Swal.fire({
                title: this.util.translate('Error'),
                text: this.util.translate('Your are blocked please contact administrator'),
                icon: 'error',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: this.util.translate('Need Help?'),
                backdrop: false,
                background: 'white'
              }).then(status => {
                if (status && status.value) {
                  console.log('uiddd----<<<', data.data.id);
                  this.id_chat = 0;
                  this.uid_chat = data.data.id;
                  this.loaded_chat = false;
                  this.name = 'Support';
                  this.getInbox();
                  this.interval = setInterval(() => {
                    console.log('calling in interval');
                    this.getInbox();
                  }, 12000);
                  this.basicModal.show();
                }
              });
            }
          } else {
            this.util.errorMessage(this.util.translate('Not valid user'));
          }
        } else if (data && data.status === 500) {
          this.util.errorMessage(data.data.message);
        } else {
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      }, error => {
        this.isLogin = false;
        console.log(error);

        this.util.errorMessage(this.util.translate('Something went wrong'));
      });

    } else {
      console.log('not valid');
    }
  }

  getInbox() {
    const param = {
      id: this.id_chat + '_' + this.uid_chat,
      oid: this.id_chat
    };
    this.api.post('chats/getById', param).then((data: any) => {
      console.log(data);
      this.loaded_chat = true;
      this.yourMessage = true;
      if (data && data.status === 200) {
        this.messages = data.data;
        this.scrollToBottom();
      }
    }, error => {
      console.log(error);
      this.loaded_chat = true;
      this.yourMessage = true;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  scrollToBottom() {
    console.log(this.scrollMe.nativeElement.scrollTop);
    this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
    console.log(this.scrollMe.nativeElement.scrollTop);
    // try {

    // } catch (err) { }
  }

  sendMessage() {
    // store to opponent
    console.log(this.msg);
    if (!this.msg || this.msg === '') {
      return false;
    }
    const msg = this.msg;
    this.msg = '';
    const param = {
      room_id: this.id_chat,
      uid: this.id_chat + '_' + this.uid_chat,
      from_id: this.uid_chat,
      message: msg,
      message_type: 'users',
      status: 1,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    // this.myContent.scrollToBottom(300);
    this.yourMessage = false;
    this.api.post('chats/save', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        this.getInbox();
      } else {
        this.yourMessage = true;
      }
    }, error => {
      console.log(error);
      this.yourMessage = true;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  closeModal() {
    clearInterval(this.interval);
    this.basicModal.hide();
  }


  loginWithMobileAndPassword(form: NgForm, modal) {
    console.log('form', form, this.mobile);
    this.submitted = true;
    if (form.valid && this.mobile.ccCode && this.mobile.phone && this.mobile.password) {
      console.log('valid');
      const param = {
        cc: '+' + this.mobile.ccCode,
        mobile: this.mobile.phone,
        password: this.mobile.password
      };
      this.isLogin = true;
      this.api.post('users/loginWithPhoneAndPassword', param).then((data) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status === 200) {
          if (data && data.data && data.data.type === 'user') {
            if (data.data.status === '1') {
              localStorage.setItem('uid', data.data.id);
              this.util.userInfo = data.data;
              const fcm = localStorage.getItem('fcm');
              if (fcm && fcm !== null && fcm !== 'null') {
                const updateParam = {
                  id: data.data.id,
                  fcm_token: fcm
                };
                this.api.post('users/edit_profile', updateParam).then((data: any) => {
                  console.log('user info=>', data);
                }, error => {
                  console.log(error);
                });
              }
              modal.hide();
              const favParam = {
                id: data.data.id
              }
              this.api.post('favourite/getByUid', favParam).then((data: any) => {
                console.log('fav data', data);
                if (data && data.status === 200 && data.data.length > 0) {
                  this.util.haveFav = true;
                  try {
                    this.util.favIds = data.data[0].ids.split(',');
                  } catch (error) {
                    console.log('eroor', error);
                  }
                } else {
                  this.util.haveFav = false;
                }
              }, error => {
                this.util.haveFav = false;
                console.log('fav error', error);
              });

            } else {
              modal.hide();
              console.log('not valid');
              Swal.fire({
                title: this.util.translate('Error'),
                text: this.util.translate('Your are blocked please contact administrator'),
                icon: 'error',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: this.util.translate('Need Help?'),
                backdrop: false,
                background: 'white'
              }).then(status => {
                if (status && status.value) {
                  this.id_chat = 0;
                  this.uid_chat = data.data.id;
                  this.loaded_chat = false;
                  this.name = 'Support';
                  this.getInbox();
                  this.interval = setInterval(() => {
                    console.log('calling in interval');
                    this.getInbox();
                  }, 12000);
                  this.basicModal.show();
                }
              });
            }
          } else {
            this.util.errorMessage(this.util.translate('Not valid user'));
            this.login.email = '';
            this.login.password = '';
          }
        } else if (data && data.status === 500) {
          this.util.errorMessage(data.data.message);
        } else {
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
    } else {
      console.log('not valid');
    }
  }

  otpLogin() {
    console.log(this.userCode);
    if (this.userCode === '' || !this.userCode) {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
    if (this.userCode) {
      const param = {
        id: this.otpId,
        otp: this.userCode
      };
      this.isLogin = true;
      this.api.post('users/verifyOTP', param).then((data: any) => {
        console.log(data);
        this.isLogin = false;
        if (data && data.status === 200) {
          const param = {
            id: this.uid
          };
          this.api.post('users/getById', param).then((data: any) => {
            console.log('user data', data);
            if (data && data.status === 200 && data.data && data.data.length && data.data[0].type === 'user') {
              this.util.userInfo = data.data[0];
              if (data && data.data && data.data[0].type === 'user') {
                if (data.data[0].status === '1') {
                  localStorage.setItem('uid', this.uid);
                  const fcm = localStorage.getItem('fcm');
                  if (fcm && fcm !== null && fcm !== 'null') {
                    const updateParam = {
                      id: this.uid,
                      fcm_token: fcm
                    };
                    this.api.post('users/edit_profile', updateParam).then((data: any) => {
                      console.log('user info=>', data);
                    }, error => {
                      console.log(error);
                    });
                  }
                  this.otpModal.hide();
                  this.loginModal.hide();
                  const favParam = {
                    id: this.uid
                  }
                  this.api.post('favourite/getByUid', favParam).then((data: any) => {
                    console.log('fav data', data);
                    if (data && data.status === 200 && data.data.length > 0) {
                      this.util.haveFav = true;
                      try {
                        this.util.favIds = data.data[0].ids.split(',');
                      } catch (error) {
                        console.log('eroor', error);
                      }
                    } else {
                      this.util.haveFav = false;
                    }
                  }, error => {
                    this.util.haveFav = false;
                    console.log('fav error', error);
                  });

                } else {
                  console.log('not valid');
                  this.otpModal.hide();
                  this.loginModal.hide();
                  Swal.fire({
                    title: this.util.translate('Error'),
                    text: this.util.translate('Your are blocked please contact administrator'),
                    icon: 'error',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: this.util.translate('Need Help?'),
                    backdrop: false,
                    background: 'white'
                  }).then(status => {
                    if (status && status.value) {
                      this.id_chat = 0;
                      this.uid_chat = data.data.id;
                      this.loaded_chat = false;
                      this.name = 'Support';
                      this.getInbox();
                      this.interval = setInterval(() => {
                        console.log('calling in interval');
                        this.getInbox();
                      }, 12000);
                      this.basicModal.show();
                    }
                  });
                }
              } else {
                this.util.errorMessage(this.util.translate('Not valid user'));
                this.login.email = '';
                this.login.password = '';
              }
            } else if (data && data.status === 500) {
              this.util.errorMessage(data.data.message);
            } else {
              this.util.errorMessage(this.util.translate('Something went wrong'));
            }
          }, error => {
            localStorage.removeItem('uid');
            console.log(error);
          });
        } else {
          if (data && data.status === 500 && data.data && data.data.message) {
            this.util.errorMessage(data.data.message);
            return false;
          }
          this.util.errorMessage(this.util.translate('Something went wrong'));
          return false;
        }
      }, error => {
        this.isLogin = false;
        console.log(error);
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
    } else {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
  }

  loginWithMobileAndOTP(form: NgForm, modal) {
    console.log('form', form, this.mobileLogin);
    this.submitted = true;
    if (form.valid && this.mobileLogin.ccCode && this.mobileLogin.phone) {
      console.log('valid');
      const param = {
        mobile: this.mobileLogin.phone,
        cc: '+' + this.mobileLogin.ccCode
      };
      this.isLogin = true;
      this.api.post('users/checkMobileNumber', param).then((data) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status === 200) {
          console.log('open modal');
          this.uid = data.data.id;
          this.sendOTP2();
          setTimeout(() => {
            this.resendCode = true;
          }, 30000);
          this.otpModal.show();
        } else if (data && data.status === 500) {
          this.util.errorMessage(data.data.message);
        } else {
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
    } else {
      console.log('not valid');
    }
  }

  onOtpChange(event) {
    console.log(event);
    this.userCode = event;
  }

  onOtpChangeReset1(event) {
    this.reset_otp = event;
  }

  resend() {
    this.sendOTP();
  }

  resend2() {
    this.sendOTP2();
  }

  sendOTP() {
    const message = 'Your Grocecryee app verification code : ';
    const param = {
      msg: message,
      to: '+' + this.registerForm.cc + this.registerForm.mobile
    };
    console.log(param);

    console.log('hide');
    this.util.start();
    this.api.post('users/twilloMessage', param).then((data: any) => {
      console.log(data);
      this.otpId = data.data.id;
      this.util.stop();
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  sendOTP2() {
    const message = 'Your Grocecryee app verification code : ';
    const param = {
      msg: message,
      to: '+' + this.mobileLogin.ccCode + this.mobileLogin.phone
    };
    console.log(param);

    console.log('hide');
    this.util.start();
    this.api.post('users/twilloMessage', param).then((data: any) => {
      console.log(data);
      this.otpId = data.data.id;
      this.util.stop();
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  verify() {
    console.log(this.userCode);
    if (this.userCode === '' || !this.userCode) {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
    if (this.userCode) {
      const param = {
        id: this.otpId,
        otp: this.userCode
      };
      this.isLogin = true;
      this.api.post('users/verifyOTP', param).then((data: any) => {
        console.log(data);
        this.isLogin = false;
        if (data && data.status === 200) {
          const registerParam = {
            first_name: this.registerForm.first_name,
            last_name: this.registerForm.last_name,
            email: this.registerForm.email,
            password: this.registerForm.password,
            gender: this.registerForm.gender,
            fcm_token: localStorage.getItem('fcm') ? localStorage.getItem('fcm') : 'NA',
            type: 'user',
            lat: '',
            lng: '',
            cover: 'NA',
            mobile: this.registerForm.mobile,
            status: 1,
            country_code: '+' + this.registerForm.cc,
            verified: 0,
            others: 1,
            date: moment().format('YYYY-MM-DD'),
            stripe_key: ''
          };

          console.log('param', registerParam);
          this.util.start();
          this.api.post('users/registerUser', registerParam).then((data: any) => {
            this.util.stop();
            console.log(data);
            if (data && data.status === 200) {
              this.util.userInfo = data.data;
              localStorage.setItem('uid', data.data.id);
              const fcm = localStorage.getItem('fcm');
              if (fcm && fcm !== null && fcm !== 'null') {
                const updateParam = {
                  id: data.data.id,
                  fcm_token: fcm
                };
                this.api.post('users/edit_profile', updateParam).then((data: any) => {
                  console.log('user info=>', data);
                }, error => {
                  console.log(error);
                });
              }
              this.sendVerification(this.login.email, this.api.baseUrl + 'users/verify?uid=' + data.data.id);
              this.verifyModal.hide();
              this.registerModal.hide();
            } else if (data && data.status === 500) {
              this.util.errorMessage(data.data.message);
            } else {
              this.util.errorMessage(this.util.translate('Something went wrong'));
            }
          }, error => {
            console.log(error);
            this.util.stop();
            this.util.errorMessage(this.util.translate('Something went wrong'));
          });
        } else {
          if (data && data.status === 500 && data.data && data.data.message) {
            this.util.errorMessage(data.data.message);
            return false;
          }
          this.util.errorMessage(this.util.translate('Something went wrong'));
          return false;
        }
      }, error => {
        this.isLogin = false;
        console.log(error);
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
    } else {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
  }

  onRegister(form: NgForm, registerModal, verification) {
    console.log(form);

    console.log('form', this.registerForm, this.ccCode);
    console.log(this.util.twillo);
    this.submitted = true;
    console.log(this.registerForm.check);
    if (form.valid && this.registerForm.check && this.registerForm.email && this.registerForm.password && this.registerForm.first_name
      && this.registerForm.last_name && this.registerForm.mobile && this.registerForm.cc) {
      console.log('valid data');
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.registerForm.email)) {
        this.util.errorMessage(this.util.translate('Please enter valid email'));
        return false;
      }
      if (this.util.twillo === '1') {
        console.log('open model=>>>');
        const param = {
          email: this.login.email,
          phone: this.registerForm.mobile,
          cc: '+' + this.registerForm.cc
        };
        this.isLogin = true;
        this.api.post('users/validatePhoneAndEmail', param).then((data: any) => {
          this.isLogin = false;
          console.log('data', data);
          if (data && data.status === 200) {
            console.log('all done...');
            setTimeout(() => {
              this.resendCode = true;
            }, 30000);
            this.sendOTP();
            verification.show();
          } else if (data && data.status === 500) {
            this.util.errorMessage(data.data.message);
          } else {
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.isLogin = false;
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }).catch(error => {
          console.log(error);
          this.isLogin = false;
          this.util.errorMessage(this.util.translate('Something went wrong'));
        });
      } else {
        console.log('login');
        const param = {
          first_name: this.registerForm.first_name,
          last_name: this.registerForm.last_name,
          email: this.registerForm.email,
          password: this.registerForm.password,
          gender: this.registerForm.gender,
          fcm_token: localStorage.getItem('fcm') ? localStorage.getItem('fcm') : 'NA',
          type: 'user',
          lat: '',
          lng: '',
          cover: 'NA',
          mobile: this.registerForm.mobile,
          status: 1,
          country_code: '+' + this.registerForm.cc,
          verified: 0,
          others: 1,
          date: moment().format('YYYY-MM-DD'),
          stripe_key: ''
        };

        console.log('param', param);
        this.isLogin = true;
        this.api.post('users/registerUser', param).then((data: any) => {
          this.isLogin = false;
          console.log(data);
          if (data && data.status === 200) {
            this.util.userInfo = data.data;
            localStorage.setItem('uid', data.data.id);
            const fcm = localStorage.getItem('fcm');
            if (fcm && fcm !== null && fcm !== 'null') {
              const updateParam = {
                id: data.data.id,
                fcm_token: fcm
              };
              this.api.post('users/edit_profile', updateParam).then((data: any) => {
                console.log('user info=>', data);
              }, error => {
                console.log(error);
              });
            }
            registerModal.hide();
            this.sendVerification(this.login.email, this.api.baseUrl + 'users/verify?uid=' + data.data.id);

          } else if (data && data.status === 500) {
            this.util.errorMessage(data.data.message);
          } else {
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.isLogin = false;
          this.util.errorMessage(this.util.translate('Something went wrong'));
        });
      }
    } else {
      console.log('not valid data...');
    }
  }

  sendVerification(mail, link) {
    const param = {
      email: mail,
      url: link
    };

    this.api.post('users/sendVerificationMail', param).then((data) => {
      console.log('mail', data);
    }, error => {
      console.log(error);
    });
  }

  // reset password
  sendResetLink() {
    console.log(this.reset_email, ';sendOTPDriver');
    if (!this.reset_email) {
      this.util.errorMessage(this.util.translate('email is required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.reset_email)) {
      this.util.errorMessage(this.util.translate('Please enter valid email'));
      return false;
    }
    this.isLogin = true;
    const param = {
      email: this.reset_email
    };
    this.api.post('users/sendOTP', param).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status === 200) {
        this.reset_id = data.data.id;
        this.isLogin = false;
        this.div_type = 2;
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.util.errorMessage(data.data.message);
          return false;
        }
        this.util.errorMessage(this.util.translate('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  verifyOTPOfReset() {
    if (!this.reset_otp || this.reset_otp === '') {
      this.util.errorMessage(this.util.translate('otp is required'));
      return false;
    }
    this.isLogin = true;
    const param = {
      id: this.reset_id,
      otp: this.reset_otp
    };
    this.api.post('users/verifyOTP', param).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status === 200) {
        this.isLogin = false;
        this.div_type = 3;
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.util.errorMessage(data.data.message);
          return false;
        }
        this.util.errorMessage(this.util.translate('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  sendEmailResetPasswordMail() {
    if (!this.reset_password || !this.reset_repass || this.reset_password === '' || this.reset_repass === '') {
      this.util.errorMessage(this.util.translate('All Field are required'));
      return false;
    }
    const param = {
      email: this.reset_email,
      pwd: this.reset_password
    };
    this.isLogin = true;
    this.api.post('users/update_password', param).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status === 200) {
        this.isLogin = false;
        this.util.suucessMessage(this.util.translate('Password Updated'));
        this.forgotPwd.hide();
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.util.errorMessage(data.data.message);
          return false;
        }
        this.util.errorMessage(this.util.translate('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  sendOTPOnMobile() {
    const param = {
      phone: this.reset_phone,
      cc: '+' + this.reset_cc
    };
    this.isLogin = true;
    this.api.post('users/validatePhoneForReset', param).then((data: any) => {
      this.isLogin = false;
      console.log('data', data);
      if (data && data.status === 200) {
        console.log('all done...');
        console.log('+', this.reset_cc, this.reset_phone);
        this.sendOTPForReset();
        this.div_type = 2;
      } else if (data && data.status === 500) {
        this.util.errorMessage(data.data.message);
      } else {
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  sendOTPForReset() {
    const message = 'Your Grocecryee app verification code : ';
    const param = {
      msg: message,
      to: '+' + this.reset_cc + this.reset_phone
    };
    console.log(param);
    this.util.start();
    this.api.post('users/twilloMessage', param).then((data: any) => {
      console.log(data);
      this.reset_id = data.data.id;
      this.util.stop();
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  verifyResetCode() {
    console.log(this.reset_otp);
    if (this.reset_otp === '' || !this.reset_otp) {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
    if (this.reset_otp) {
      const param = {
        id: this.reset_id,
        otp: this.reset_otp
      };
      this.isLogin = true;
      this.api.post('users/verifyOTP', param).then((data: any) => {
        console.log(data);
        this.isLogin = false;
        if (data && data.status === 200) {
          this.div_type = 3;
          // this.modalCtrl.dismiss('', 'ok');
        } else {
          if (data && data.status === 500 && data.data && data.data.message) {
            this.util.errorMessage(data.data.message);
            return false;
          }
          this.util.errorMessage(this.util.translate('Something went wrong'));
          return false;
        }
      }, error => {
        this.isLogin = false;
        console.log(error);
        this.util.errorMessage(this.util.translate('Something went wrong'));
      });
    } else {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
  }

  resetPasswordWithPhone() {
    console.log('pwddd0<<<<<<', this.reset_password);
    if (!this.reset_password || !this.reset_repass || this.reset_password === '' || this.reset_repass === '') {
      this.util.errorMessage(this.util.translate('All Field are required'));
      return false;
    }
    const param = {
      phone: this.reset_phone,
      pwd: this.reset_password
    };
    this.isLogin = true;
    this.api.post('users/resetPasswordWithPhone', param).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status === 200) {
        this.isLogin = false;
        this.util.suucessMessage(this.util.translate('Password Updated'));
        this.forgotPwd.hide();
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.util.errorMessage(data.data.message);
          return false;
        }
        this.util.errorMessage(this.util.translate('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }
  // reset password
  // login system


  getContent() {
    return 'By clicking on the I agree button click, download or if you use the Application, you agree to be bound by the';
  }
}
