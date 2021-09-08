/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { NavController, Platform } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { AddressService } from 'src/app/services/address.service';
import { Address } from 'src/app/models/address.model';
declare var google;

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
  @ViewChild('map', { static: true }) mapEle: ElementRef;

  title: any = 'home';
  address: any = '';
  lat: any;
  lng: any;
  house: any = '';
  landmark: any = '';
  zipcode: any = '';

  id: any;
  from: any;
  map: any;
  marker: any;

  gotLatLng: boolean = false;
  constructor(
    public geolocation: Geolocation,
    private androidPermissions: AndroidPermissions,
    private navCtrl: NavController,
    private api: ApiService,
    private auth: AuthService,
    public util: UtilService,
    private route: ActivatedRoute,
    private platform: Platform,
    private addressServ: AddressService
  ) {
    this.gotLatLng = false;
    this.route.queryParams.subscribe(routing => {
      if (routing && routing.from) {
        this.from = 'edit';
        const info = JSON.parse(routing.data);
        this.id = info.uuid;
        this.address = info.address;
        this.house = info.house;
        this.landmark = info.landmark;
        this.lat = info.lat;
        this.lng = info.lng;
        this.zipcode = info.zipcode;
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
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'Galyon by BytesCrafter']
      }
    };
    this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
    const mapType = new google.maps.StyledMapType(style, { name: 'Grayscale' });
    this.map.mapTypes.set('Galyon by BytesCrafter', mapType);
    this.map.setMapTypeId('Galyon by BytesCrafter');
    this.addMarker(location);
  }

  addMarker(location) {
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
    if (this.auth.userToken.uuid === '' || this.title === '' || this.address === '' || 
    this.house === '' || this.lat === '' || this.lng === '') {
      this.util.errorToast(this.util.getString('House address is required!'));
      return false;
    }

    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.zipcode }, (results, status) => {
      if (status === 'OK' && results && results.length) {
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        this.util.show();
        this.api.post('galyon/v1/address/createNewAddress', {
          uid: this.auth.userToken.uuid,
          type: this.title,
          address: this.address,
          house: this.house,
          landmark: this.landmark,
          zipcode: this.zipcode,
          lat: this.lat,
          lng: this.lng,
        }).subscribe((response: any) => {
          this.util.hide();
          if (response && response.success && response.data) {
            if(response.success) {
              this.util.showToast('Address added', 'success', 'bottom');
              this.addressServ.request(this.auth.userToken.uuid, null);
              this.navCtrl.back();
            }
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
    if (this.auth.userToken.uuid === '' || this.title === '' || this.address === '' || 
    this.house === '' || this.lat === '' || this.lng === '') {
      this.util.errorToast(this.util.getString('All Fields are required'));
      return false;
    }

    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.zipcode }, (results, status) => {
      if (status === 'OK' && results && results.length) {
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();

        this.util.show();
        this.api.post('galyon/v1/address/editAddresssCurrent', {
          uuid: this.id,
          uid: this.auth.userToken.uuid,
          type: this.title,
          address: this.address,
          house: this.house,
          landmark: this.landmark,
          zipcode: this.zipcode,
          lat: this.lat,
          lng: this.lng,
        }).subscribe((response: any) => {
          this.util.hide();
          if (response && response.success && response.data) {
            this.util.showToast('Address updated', 'success', 'bottom');
            this.addressServ.request(this.auth.userToken.uuid, null);
            this.navCtrl.back();
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
