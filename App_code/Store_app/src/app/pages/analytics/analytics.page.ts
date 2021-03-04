/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import * as moment from 'moment';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {
  @ViewChild('invoiceTicket', { read: ElementRef }) private invoiceTicket: ElementRef;
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
    public util: UtilService,
    public api: ApiService,
    private printService: Printer,
  ) {

  }

  ngOnInit() {
  }

  getStats() {
    this.storename = this.util.store.name;
    this.storecommission = parseFloat(this.util.store.commission);
    if (this.from && this.to) {
      this.from = moment(this.from).format('YYYY-MM-DD');
      this.to = moment(this.to).format('YYYY-MM-DD');
      const param = {
        sid: localStorage.getItem('uid'),
        start: moment(this.from, 'YYYY-MM-DD HH:mm A').utc(false).format('YYYY-MM-DD HH:mm'),
        end: moment(this.to, 'YYYY-MM-DD HH:mm A').utc(false).format('YYYY-MM-DD HH:mm'),
      };
      console.log(param);
      this.util.show();
      this.apiCalled = false;
      this.storeOrder = [];
      this.api.post('orders/storeStats', param).subscribe((data: any) => {
        this.apiCalled = true;
        this.util.hide();
        console.log(data);
        // if (data && data.status === 200 && data.data.length) {
        //   data.data.forEach(element => {
        //     element.orders = JSON.parse(element.orders);
        //     element.date_time = moment(element.date_time).format('YYYY-MM-DD');
        //   });
        //   let total = 0;
        //   data.data.forEach(async (element) => {
        //     element.orders = await element.orders.filter(x => x.store_id === localStorage.getItem('uid'));
        //     const info = JSON.parse(element.status);
        //     await element.orders.forEach(calc => {
        //       if (calc.sell_price === '0.00') {
        //         total = total + parseFloat(calc.original_price);
        //       } else {
        //         total = total + parseFloat(calc.sell_price);
        //       }
        //     });
        //     const selected = await info.filter(x => x.id === localStorage.getItem('uid'));
        //     if (selected && selected.length) {
        //       if (selected[0].status === 'delivered') {
        //         this.storeOrder.push(element);
        //       }
        //     }
        //   });
        //   setTimeout(() => {
        //     function percentage(num, per) {
        //       return (num / 100) * per;
        //     }
        //     console.log(this.storeOrder);
        //     console.log(total, this.storecommission);
        //     const totalPrice = percentage(total, parseFloat(this.storecommission));
        //     console.log('commistion=====>>>>>', totalPrice.toFixed(2));
        //     this.commisionAmount = totalPrice.toFixed(2);
        //     this.totalAmount = total;
        //     this.toPay = this.commisionAmount;
        //   }, 1000);

        // }

        if (data && data.status === 200 && data.data.length) {
          let total = 0;
          data.data.forEach(async (element) => {
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
              element.orders = JSON.parse(element.orders);
              element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
              element.orders = await element.orders.filter(x => x.store_id === localStorage.getItem('uid'));
              if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
                const info = JSON.parse(element.status);
                await element.orders.forEach(calc => {
                  if (calc.variations && calc.variations !== '' && typeof calc.variations === 'string') {
                    console.log('strings', calc.id);
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
                const selected = await info.filter(x => x.id === localStorage.getItem('uid'));
                if (selected && selected.length) {
                  if (selected[0].status === 'delivered') {
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
        this.util.hide();
        console.log(error);
        this.apiCalled = true;
        this.util.errorToast(this.util.getString('Something went wrong'));
      });
    } else {
      this.util.errorToast(this.util.getString('All Fields are required'));
    }
  }

  print() {
    const content = this.invoiceTicket.nativeElement.innerHTML;
    console.log('content', content);
    const options: PrintOptions = {
      name: 'Groceryee App Summary',
      duplex: false,
    };
    this.printService.print(content, options).then((data) => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }

  today() {
    return moment().format('ll');
  }
  getDate(date) {
    return moment(date).format('ll');
  }

  getCommisions(total) {
    return ((parseFloat(total) * this.storecommission) / 100).toFixed(2);
  }
}
