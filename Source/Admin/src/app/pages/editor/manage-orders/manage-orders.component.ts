/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { UtilService } from 'src/app/services/util.service';
import { Order } from 'src/app/models/order.class';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent {

  id: any;
  public withData: boolean = false;
  public current: Order = new Order();

  constructor(
    public api: ApisService,
    private route: ActivatedRoute,
    private navCtrl: Location,
    public util: UtilService
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data && data.uuid) {
        this.id = data.uuid;
        this.getOrder();
      } else {
        this.navCtrl.back();
      }
    });
  }

  ngOnInit(): void {
  }

  back() {
    this.navCtrl.back();
  }

  getOrder() {
    const param = {
      id: this.id
    };
    this.api.post('galyon/v1/orders/getOrdersById', {
      uuid: this.id,
      has_store_name: "1",
      has_address_name: "1"
    }).then((response: any) => {
      console.log(response);
      if (response && response.success && response.data) {
        this.current = response.data;
      } else {
        this.util.error('Something went wrong');
      }
      // if (data && data.status === 200 && data.data.length > 0) {
      //   const info = data.data[0];
      //   console.log(info);
      //   if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.orders)) {
      //     if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.notes)) {
      //       this.orderDetail = JSON.parse(info.notes);
      //       const order = JSON.parse(info.orders);
      //       console.log('order=====>>', order);
      //       const finalOrder = [];
      //       const ids = [...new Set(order.map(item => item.store_id))];
      //       ids.forEach(element => {
      //         const param = {
      //           id: element,
      //           order: []
      //         };
      //         finalOrder.push(param);
      //       });

      //       ids.forEach((element, index) => {
      //         order.forEach(cart => {
      //           if (cart.variations && cart.variations !== '' && typeof cart.variations === 'string') {
      //             cart.variations = JSON.parse(cart.variations);
      //             console.log(cart['variant']);
      //             if (cart["variant"] === undefined) {
      //               cart['variant'] = 0;
      //             }
      //           }
      //           if (cart.store_id === element) {
      //             finalOrder[index].order.push(cart);
      //           }
      //         });
      //       });
      //       console.log('final order', finalOrder);
      //       this.orders = finalOrder;
      //       this.status = JSON.parse(info.status);
      //       console.log('order status--------------------', this.status);

      //       const status = this.status.filter(x => x.status === 'created');
      //       if (status.length === this.status.length) {
      //         this.canCancle = true;
      //       } else {
      //         this.canCancle = false;
      //       }

      //       const delivered = this.status.filter(x => x.status === 'delivered');
      //       if (delivered.length === this.status.length) {
      //         this.isDelivered = true;
      //       } else {
      //         this.isDelivered = false;
      //       }

      //       // if()
      //       this.datetime = moment(info.date_time).format('dddd, MMMM Do YYYY');
      //       this.payMethod = info.paid_method === 'cod' ? 'COD' : 'PAID';
      //       this.orderAt = info.order_to;
      //       this.driverId = info.driver_id;
      //       if (this.driverId && this.driverId !== '') {
      //         const userinfo = {
      //           id: this.driverId
      //         };
      //         this.api.post('drivers/getDriversData', userinfo).then((data: any) => {
      //           console.log('driverid>', data);
      //           if (data && data.status === 200 && data.data && data.data.length) {
      //             this.driverInfo = data.data;
      //             console.log(this.driverInfo);
      //           }
      //         }, error => {
      //           console.log(error);
      //         }).catch(error => {
      //           console.log(error);
      //         });
      //       }

      //       const stores = {
      //         id: info.store_id
      //       };
      //       this.api.post('stores/getStoresData', stores).then((data: any) => {
      //         console.log('store=-============>>', data);
      //         console.log('store=-============>>', data);
      //         if (data && data.status === 200 && data.data.length) {
      //           this.stores = data.data;

      //         } else {
      //           // this.util.showToast('No Stores Found', 'danger', 'bottom');
      //           this.error('No Stores Found');
      //           this.back();
      //         }
      //       }, error => {
      //         console.log('error', error);
      //         this.error('Something went wrong');
      //       }).catch(error => {
      //         console.log('error', error);
      //         this.error('Something went wrong');
      //       });
      //       if (this.orderAt === 'home') {
      //         const address = JSON.parse(info.address);
      //         console.log('---address', address);
      //         if (address && address.address) {
      //           this.userLat = address.lat;
      //           this.userLng = address.lng;
      //           this.address = address.address;
      //         }
      //       }
      //     }
      //   }

      // } else {
      //   this.back();
      //   this.error('Something went wrong');
      // }
    }).catch(error => {
      this.back();
      this.util.error('Something went wrong');
    });
  }

  getItemPrice(item, quantity = 1){
    if(item) {
      let sell_price: number = 0;
      let item_price: number = parseFloat(item.price);
      let item_discount: number = parseFloat(item.discount);
      if(item.discount_type == "percent") {
        item_discount = item_price*(item_discount/100);
      } else if(item.discount_type == "fixed") {
        item_discount = item_discount;
      } else {
        item_discount = 0;
      }
      sell_price = item_price-item_discount;

      item.variations.forEach(pvar => {
        let var_price = parseFloat(pvar.price);
        let var_discount = parseFloat(pvar.discount);
        let var_discounted = var_price-(var_price*(var_discount/100));
        sell_price += var_discounted;
      });
      sell_price *= quantity;

      return sell_price.toFixed(2);
    }
  }
}
