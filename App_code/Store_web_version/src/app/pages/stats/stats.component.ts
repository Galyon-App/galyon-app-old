/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  stores: any[] = [];
  storeId: any;
  storecommission: any;
  from: any;
  to: any;
  allOrders: any[] = [];
  storeOrder: any[] = [];
  totalAmount: any = 0;
  commisionAmount: any = 0;
  toPay: any = 0;
  apiCalled: boolean;
  storename: any;

  totalAmountsFromOrder: any = 0;
  constructor(
    private api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    public util: UtilService
  ) {
    console.log(this.util.storeInfo);
    this.storeId = localStorage.getItem('uid');
    if (this.util.storeInfo && this.util.storeInfo.commission) {
      this.storecommission = parseFloat(this.util.storeInfo.commission);
    } else {
      this.error(this.util.getString('No Store Found'));
    }
  }

  ngOnInit() {
  }

  getStats() {
    console.log('from', this.from);
    console.log('to', this.to);
    if (this.storeId && this.from && this.to) {

      console.log('ok');
      const param = {
        sid: this.storeId,
        start: moment(this.from, 'YYYY-MM-DD HH:mm A').utc(false).format('YYYY-MM-DD HH:mm'),
        end: moment(this.to, 'YYYY-MM-DD HH:mm A').utc(false).format('YYYY-MM-DD HH:mm'),
      };
      console.log(param);
      this.spinner.show();
      this.apiCalled = false;
      this.storeOrder = [];
      this.api.post('orders/storeStats', param).then((data: any) => {
        this.apiCalled = true;
        this.spinner.hide();
        console.log(data);
        if (data && data.status === 200 && data.data.length) {
          let total = 0;
          data.data.forEach(async (element) => {
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
              element.orders = JSON.parse(element.orders);
              element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
              element.orders = await element.orders.filter(x => x.store_id === this.storeId);
              if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
                const info = JSON.parse(element.status);

                const selected = await info.filter(x => x.id === this.storeId);
                if (selected && selected.length) {
                  if (selected[0].status === 'delivered') {
                    await element.orders.forEach(calc => {
                      if (calc.variations && calc.variations !== '' && typeof calc.variations === 'string') {
                        calc.variations = JSON.parse(calc.variations);
                        console.log(calc['variant']);
                        if (calc["variant"] === undefined) {
                          calc['variant'] = 0;
                        }
                      }
                      if (calc && calc.discount === '0') {
                        if (calc.size === '1' || calc.size === 1) {
                          if (calc.variations[0].calc[calc.variant].discount && calc.variations[0].items[calc.variant].discount !== 0) {
                            total = total + (parseFloat(calc.variations[0].items[calc.variant].discount) * calc.quantiy);
                          } else {
                            total = total + (parseFloat(calc.variations[0].items[calc.variant].price) * calc.quantiy);
                          }
                        } else {
                          total = total + (parseFloat(calc.original_price) * calc.quantiy);
                        }
                      } else {
                        if (calc.size === '1' || calc.size === 1) {
                          if (calc.variations[0].items[calc.variant].discount && calc.variations[0].items[calc.variant].discount !== 0) {
                            total = total + (parseFloat(calc.variations[0].items[calc.variant].discount) * calc.quantiy);
                          } else {
                            total = total + (parseFloat(calc.variations[0].items[calc.variant].price) * calc.quantiy);
                          }
                        } else {
                          total = total + (parseFloat(calc.sell_price) * calc.quantiy);
                        }
                      }
                    });
                    this.storeOrder.push(element);
                  }
                }
              }
            }
          });

          setTimeout(() => {
            function percentage(num, per) {
              return (num / 100) * per;
            }
            console.log(this.storeOrder);
            console.log(total, this.storecommission);
            const totalPrice = percentage(total, parseFloat(this.storecommission));
            console.log('commistion=====>>>>>', totalPrice.toFixed(2));
            this.commisionAmount = totalPrice.toFixed(2);
            this.totalAmount = total;
            this.toPay = this.commisionAmount;
          }, 1000);

        }
      }, error => {
        this.spinner.hide();
        console.log(error);
        this.apiCalled = true;
        this.error(this.util.getString('Something went wrong'));
      }).catch((error) => {
        this.spinner.hide();
        console.log(error);
        this.apiCalled = true;
        this.error(this.util.getString('Something went wrong'));
      });
    } else {
      console.log('not valid');
      this.error(this.util.getString('All Fields are required'));
      return false;
    }
  }



  error(message) {
    const toastOptions: ToastOptions = {
      title: this.util.getString('Error'),
      msg: message,
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }

  success(message) {
    const toastOptions: ToastOptions = {
      title: this.util.getString('Success'),
      msg: message,
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }

  getCommisions(total) {
    return ((parseFloat(total) * this.storecommission) / 100).toFixed(2);
  }

  donwloadPDF() {

  }
  today() {
    return moment().format('ll');
  }
  getDate(date) {
    return moment(date).format('ll');
  }
  getName() {
    return this.storeOrder[0].name + '_' + moment(this.from).format('DDMMYYYY') + '_' + moment(this.to).format('DDMMYYYY');
  }
  getCurrency() {
    return this.api.getCurrecySymbol();
  }

}
