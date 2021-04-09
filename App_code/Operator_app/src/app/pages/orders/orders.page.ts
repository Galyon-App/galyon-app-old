/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
declare var google;
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  segment = 1;

  map: any;
  circle: any;
  latOri: any;
  longOri: any;

  newOrders: any[] = [];
  onGoingOrders: any[] = [];
  oldOrders: any[] = [];
  dummy = Array(50);
  olders: any[] = [];
  limit: any;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router,
  ) {
    if (this.util.general && this.util.general.address) {
      const geocoder = new google.maps.Geocoder;
      geocoder.geocode({
        address: this.util.general.address + ' ' + this.util.general.city + ' ' +
          this.util.general.state + ' ' + this.util.general.country + ' ' + this.util.general.zip
      }, (results, status) => {
        if (status === 'OK' && results && results.length) {
          this.latOri = results[0].geometry.location.lat();
          this.longOri = results[0].geometry.location.lng();
          this.loadMap(this.latOri, this.longOri);
        }
      });
    }
  }

  loadMap(lat, lng) {

    const latLng = new google.maps.LatLng(lat, lng);

    const mapOptions = {
      center: latLng,
      zoom: 12,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: false,
      overviewMapControl: false,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    const marker = new google.maps.Marker({
      map: this.map,
      position: latLng
    });
    const sunCircle = {
      strokeColor: '#49befc',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#49befc',
      fillOpacity: 0.35,
      map: this.map,
      center: latLng,
    };
    this.circle = new google.maps.Circle(sunCircle);
    this.circle.bindTo('center', marker, 'position');

  }

  ngOnInit() {
  }

  getOrder() {
    console.log('enter');
    this.segment = 1;
    this.newOrders = [];
    this.onGoingOrders = [];
    this.oldOrders = [];
    this.dummy = Array(50);
    this.getOrders('', false);
  }

  onClick(val) {
    //this.segment = val;
  }

  goToOrder(ids) {
    console.log(ids);
    const navData: NavigationExtras = {
      queryParams: {
        id: ids.id
      }
    };
    this.router.navigate(['/order-detail'], navData);
  }

  getOrders(event, haveRefresh) {
    
    this.limit = 1;
    this.dummy = Array(50);

    const param = {
      id: localStorage.getItem('uid')
    };

    this.newOrders = [];
    this.onGoingOrders = [];
    this.oldOrders = [];

    this.api.post('orders/getByStore', param).subscribe((data: any) => {
      this.dummy = [];
      if (data && data.status === 200 && data.data.length > 0) {
        data.data.forEach(async (element, index) => {

          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {

            element.orders = JSON.parse(element.orders);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            element.orders = await element.orders.filter(x => x.store_id === localStorage.getItem('uid'));

            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {

              const info = JSON.parse(element.status);
              const selected = info.filter(x => x.id === localStorage.getItem('uid'));

              if (selected && selected.length) {

                element.orders.forEach(order => {
                  if (order.variations && order.variations !== '' && typeof order.variations === 'string') {
                    order.variations = JSON.parse(order.variations);
                    if (order["variant"] === undefined) {
                      order['variant'] = 0;
                    }
                  }
                });

                const status = selected[0].status;
                element['storeStatus'] = status;

                if (status === 'created') {
                  this.newOrders.push(element);
                } else if (status === 'accepted' || status === 'picked' || status === 'ongoing') {
                  this.onGoingOrders.push(element);
                } else if (status === 'rejected' || status === 'cancelled' || status === 'delivered' || status === 'refund') {
                  this.oldOrders.push(element);
                }
              }
            }
          }

          if (data.data.length === (index + 1)) {
            //console.log('same index');
            //this.loadMore(null, true);
          }
        });

        if (haveRefresh) {
          event.target.complete();
        }
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  getProfilePic(item) {
    return item && item.cover ? item.cover : 'assets/imgs/user.jpg';
  }

  getCurrency() {
    // return this.util.getCurrecySymbol();
    return '$';
  }

  doRefresh(event) {
    console.log(event);
    this.getOrders(event, true);
  }

  async loadMore(event, value) {

    //TODO: Fetch new orders with last id and put it to this.olders.

    await this.olders.forEach((element, index) => {
      this.oldOrders.push(element);
    });

    if (event != null) {
      event.target.complete();
    }
  }
}
