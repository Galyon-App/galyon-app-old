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
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { NavController, Platform } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
declare var google;

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
  @ViewChild('map', { static: true }) mapEle: ElementRef;
  map: any;
  marker: any;
  lat: any;
  lng: any;
  address: any = '';
  house: any = '';
  landmark: any = '';
  title: any = 'home';
  pincode: any = '';
  id: any;
  from: any;

  gotLatLng: boolean = false;
  constructor(
    public geolocation: Geolocation,
    private androidPermissions: AndroidPermissions,
    private navCtrl: NavController,
    private api: ApiService,
    public util: UtilService,
    private route: ActivatedRoute,
    private platform: Platform,
  ) {
    this.gotLatLng = false;
    this.route.queryParams.subscribe(data => {
      console.log(data);
      if (data && data.from) {
        this.from = 'edit';
        const info = JSON.parse(data.data);
        console.log('da===>', info);
        this.address = info.address;
        this.house = info.house;
        this.id = info.id;
        this.landmark = info.landmark;
        this.lat = info.lat;
        this.lng = info.lng;
        this.pincode = info.pincode;
        this.loadmap(this.lat, this.lng, this.mapEle);
      } else {
        this.from = 'new';
        this.getLocation();
      }
    });
  }

  getLocation() {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
          result => console.log('Has permission?', result.hasPermission),
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
        );
        this.grantRequest();
      } else if (this.platform.is('ios')) {
        this.grantRequest();
      } else {
        this.geolocation.getCurrentPosition({ maximumAge: 9000, timeout: 20000, enableHighAccuracy: true }).then((resp) => {
          if (resp) {
            console.log('resp', resp);
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
            this.gotLatLng = true;
            this.loadmap(resp.coords.latitude, resp.coords.longitude, this.mapEle);
            this.getAddress(this.lat, this.lng);
          }
        }, error => {
          console.log(error);
        }).catch(error => {
          console.log(error);
        });
        this.geolocation.watchPosition({
          enableHighAccuracy: true,
          maximumAge: 8000,
        }).subscribe(position => {
          if (position.coords !== undefined && this.gotLatLng === false) {
            console.log('ok', position);
            this.gotLatLng = true;
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.loadmap(position.coords.latitude, position.coords.longitude, this.mapEle);
            this.getAddress(this.lat, this.lng);
          }
        });
      }
    });
  }

  grantRequest() {
    this.geolocation.getCurrentPosition({ maximumAge: 9000, timeout: 20000, enableHighAccuracy: true }).then((resp) => {
      if (resp) {
        console.log('resp', resp);
        this.gotLatLng = true;
        this.loadmap(resp.coords.latitude, resp.coords.longitude, this.mapEle);
        this.getAddress(resp.coords.latitude, resp.coords.longitude);
      }
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
    this.geolocation.watchPosition({
      enableHighAccuracy: true,
      maximumAge: 8000,
    }).subscribe(position => {
      if (position.coords !== undefined && this.gotLatLng === false) {
        console.log('ok', position);
        this.gotLatLng = true;
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.loadmap(position.coords.latitude, position.coords.longitude, this.mapEle);
        this.getAddress(this.lat, this.lng);
      }
    });
  }

  getAddress(lat, lng) {
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'location': location }, (results, status) => {
      console.log(results);
      this.address = results[0].formatted_address;
      this.lat = lat;
      this.lng = lng;
    });
  }

  ngOnInit() {
  }

  loadmap(lat, lng, mapElement) {
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
      zoom: 15,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: false,
      overviewMapControl: false,
      center: location,
      mapTypeControl: false,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'Foodfire5']
      }
    };
    this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
    const mapType = new google.maps.StyledMapType(style, { name: 'Grayscale' });
    this.map.mapTypes.set('Foodfire5', mapType);
    this.map.setMapTypeId('Foodfire5');
    this.addMarker(location);
  }


  addMarker(location) {
    console.log('location =>', location);
    const icons = {
      url: 'assets/icon/marker.png',
      scaledSize: new google.maps.Size(50, 50), // scaled size
    };
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: icons,
      draggable: true,
      animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(this.marker, 'dragend', () => {
      console.log(this.marker);
      this.getDragAddress(this.marker);
    });

  }

  getDragAddress(event) {

    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(event.position.lat(), event.position.lng());
    geocoder.geocode({ 'location': location }, (results, status) => {
      console.log(results);
      this.address = results[0].formatted_address;
      this.lat = event.position.lat();
      this.lng = event.position.lng();
    });
  }

  addAddress() {
    if (this.address === '' || this.landmark === '' || this.house === '' || this.pincode === '') {

      this.util.errorToast(this.util.getString('All Fields are required'));
      return false;
    }
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
      console.log(results, status);
      if (status === 'OK' && results && results.length) {
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        console.log('----->', this.lat, this.lng);
        console.log('call api');
        this.util.show();
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
        this.api.post('address/save', param).subscribe((data: any) => {
          this.util.hide();
          if (data && data.status === 200) {
            this.util.publishNewAddress();
            this.navCtrl.back();
            this.util.showToast('Address added', 'success', 'bottom');
          } else {
            this.util.errorToast(this.util.getString('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.getString('Something went wrong'));
        });
      } else {
        this.util.errorToast(this.util.getString('Something went wrong'));
        return false;
      }
    });

  }

  updateAddress() {
    if (this.address === '' || this.landmark === '' || this.house === '' || this.pincode === '') {
      this.util.errorToast(this.util.getString('All Fields are required'));
      return false;
    }
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
      console.log(results, status);
      if (status === 'OK' && results && results.length) {
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        console.log('----->', this.lat, this.lng);
        const param = {
          id: this.id,
          uid: localStorage.getItem('uid'),
          address: this.address,
          lat: this.lat,
          lng: this.lng,
          title: this.title,
          house: this.house,
          landmark: this.landmark,
          pincode: this.pincode
        };
        this.util.show();
        this.api.post('address/editList', param).subscribe((data: any) => {
          this.util.hide();
          if (data && data.status === 200) {
            this.util.publishNewAddress();
            this.navCtrl.back();
            this.util.showToast('Address updated', 'success', 'bottom');
          } else {
            this.util.errorToast(this.util.getString('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.getString('Something went wrong'));
        });
      } else {
        this.util.errorToast(this.util.getString('Something went wrong'));
        return false;
      }
    });
  }

  back() {
    this.navCtrl.back();
  }
}
