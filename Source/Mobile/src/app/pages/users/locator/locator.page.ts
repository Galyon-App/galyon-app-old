import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
declare var google;

@Component({
  selector: 'app-locator',
  templateUrl: './locator.page.html',
  styleUrls: ['./locator.page.scss'],
})
export class LocatorPage implements OnInit {
  @ViewChild('map', { static: true }) mapEle: ElementRef;

  map: any;
  lat: any;
  lng: any;
  marker: any;
  gotLatLng: boolean = false;
  
  constructor(
    public geolocation: Geolocation,
    private androidPermissions: AndroidPermissions,
    private api: ApiService,
    private platform: Platform,
    private util: UtilService
  ) { 
    this.getLocation();
    // this.api.externalGets('https://wordpress.dev/wp-admin/admin-ajax.php', {
    //   action: 'CardMake_MapListings_AJAX',
    //   islocator: '1',
    //   limit: 'all'
    // }).subscribe((data: any) => {
    //   console.log('locator', data);
    // }, error => {
    //   console.log(error);
    //   this.util.errorToast(this.util.getString('Something went wrong'));
    // });
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
      //this.address = results[0].formatted_address;
      this.lat = lat;
      this.lng = lng;
    });
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
      zoom: 6,
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
      //this.address = results[0].formatted_address;
      this.lat = event.position.lat();
      this.lng = event.position.lng();
    });
  }

  ngOnInit() {
  }

}
