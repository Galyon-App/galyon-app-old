import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
declare var google: any;
@Component({
  selector: 'app-direction',
  templateUrl: './direction.page.html',
  styleUrls: ['./direction.page.scss'],
})
export class DirectionPage implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  map: any;

  myLat: any;
  myLng: any;

  driverLat: any;
  driverLng: any;

  storeLat: any;
  storeLng: any;

  storeInfo: any;
  driverInfo: any;

  who: any;
  uid: any;
  interval: any;

  orderAt: any;
  homeLat: any;
  homeLng: any;

  orderId: any;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private route: ActivatedRoute,
    public navCtrl: NavController,
    private iab: InAppBrowser,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    public geolocation: Geolocation,
    private alertController: AlertController
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id && data.lat && data.lng && data.who) {
        this.uid = data.id;
        this.orderId = data.orderId;
        this.who = data.who;
        this.orderAt = data.orderAt;
        this.homeLat = data.homeLat;
        this.homeLng = data.homeLng;

        if (this.who === 'driver') {
          this.driverLat = data.lat;
          this.driverLng = data.lng;
          this.homeLat = parseFloat(this.homeLat);
          this.homeLng = parseFloat(this.homeLng);
          this.driverLat = parseFloat(this.driverLat);
          this.driverLng = parseFloat(this.driverLng);
          const param = {
            id: this.uid
          };
          this.api.post('drivers/getById', param).subscribe((infoss: any) => {
            console.log('******************* driver --->>>> driverinfo --->', infoss);
            if (infoss && infoss.status === 200 && infoss.data && infoss.data.length) {
              this.driverInfo = infoss.data[0];
              this.driverLat = parseFloat(infoss.data[0].lat);
              this.driverLng = parseFloat(infoss.data[0].lng);
              this.loadMap(this.driverLat, this.driverLng, this.homeLat, this.homeLng);
            }
          }, error => {
            console.log('==>>', error);
          });

        } else {
          this.storeLat = parseFloat(data.lat);
          this.storeLng = parseFloat(data.lng);
          const param = {
            id: this.uid
          };
          this.api.post('stores/getByUid', param).subscribe((data: any) => {
            console.log('*******************', data);
            if (data && data.status === 200 && data.data && data.data.length) {
              this.storeLat = parseFloat(data.data[0].lat);
              this.storeLng = parseFloat(data.data[0].lng);
              this.storeInfo = data.data[0];
              this.getMyLocation();
            }
          }, error => {
            console.log(error);
          });

        }
      } else {
        this.navCtrl.back();
      }
    });
  }

  callDriver() {
    this.iab.create('tel:' + this.driverInfo.mobile, '_system');
  }
  callStore() {
    this.iab.create('tel:' + this.storeInfo.mobile, '_system');
  }


  getMyLocation() {
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
        this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: false }).then((resp) => {
          if (resp) {
            console.log('resp', resp);
            this.myLat = resp.coords.latitude;
            this.myLng = resp.coords.longitude;
            this.loadMap(this.myLat, this.myLng, this.storeLat, this.storeLng);
          }
        }).catch(error => {
          console.log(error);
          this.grantRequest();
        });
        const watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
          if (data && data.coords) {
            console.log('update', data.coords);
            this.myLat = data.coords.latitude;
            this.myLng = data.coords.longitude;
          }
        });
      }
    });
  }

  grantRequest() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: false }).then((resp) => {
      if (resp) {
        console.log('resp 1', resp);
        this.myLat = resp.coords.latitude;
        this.myLng = resp.coords.longitude;
        this.loadMap(this.myLat, this.myLng, this.storeLat, this.storeLng);
      }
    }).catch(error => {
      console.log(error);
      console.log('ASK Permission');
      if (this.platform.is('ios')) {
        this.iOSAlert();
      } else {
        this.presentAlertConfirm();
      }
    });
    const watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      if (data && data.coords) {
        console.log('update', data.coords);
        this.myLat = data.coords.latitude;
        this.myLng = data.coords.longitude;
      }
    });
  }

  async iOSAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Location error',
      message: 'Please Enable Location Service from settings for best experience',
      buttons: ['OK']
    });
    await alert.present();
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'Please Enable Location Service for best experience',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.askPermission();
          }
        }
      ]
    });

    await alert.present();
  }

  askPermission() {
    this.getMyLocation();
  }
  getDriverLocation(marker, maps) {
    const param = {
      id: this.uid
    };
    this.api.post('drivers/getById', param).subscribe((data: any) => {
      console.log('******************* driver --->>>> driverinfo --->', data);
      if (data && data.status === 200 && data.data && data.data.length) {
        this.driverLat = parseFloat(data.data[0].lat);
        this.driverLng = parseFloat(data.data[0].lng);
        this.changeMarkerPosition(marker, maps);
      }
    }, error => {
      console.log('==>>', error);
    });
  }

  loadMap(latOri, lngOri, latDest, lngDest) {

    const directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay = new google.maps.DirectionsRenderer();
    const bounds = new google.maps.LatLngBounds;

    const origin1 = { lat: parseFloat(latOri), lng: parseFloat(lngOri) };
    const destinationA = { lat: latDest, lng: lngDest };

    const maps = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: latOri, lng: lngOri },
      disableDefaultUI: true,
      zoom: 100
    });

    const custPos = new google.maps.LatLng(latOri, lngOri);
    const restPos = new google.maps.LatLng(latDest, lngDest);

    const logo = {
      url: 'assets/marker.png',
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    const marker = new google.maps.Marker({
      map: maps,
      position: custPos,
      animation: google.maps.Animation.DROP,
      icon: logo,
    });
    const markerCust = new google.maps.Marker({
      map: maps,
      position: restPos,
      animation: google.maps.Animation.DROP,
    });
    marker.setMap(maps);
    markerCust.setMap(maps);

    directionsDisplay.setMap(maps);
    // directionsDisplay.setOptions({ suppressMarkers: true });
    directionsDisplay.setOptions({
      polylineOptions: {
        strokeWeight: 4,
        strokeOpacity: 1,
        strokeColor: '#44C261'
      },
      suppressMarkers: true
    });
    const geocoder = new google.maps.Geocoder;

    const service = new google.maps.DistanceMatrixService;

    service.getDistanceMatrix({
      origins: [origin1],
      destinations: [destinationA],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function (response, status) {
      if (status !== 'OK') {
        alert('Error was: ' + status);
      } else {
        const originList = response.originAddresses;
        const destinationList = response.destinationAddresses;
        const showGeocodedAddressOnMap = function (asDestination) {
          return function (results, status) {
            if (status === 'OK') {
              maps.fitBounds(bounds.extend(results[0].geometry.location));
            } else {
              alert('Geocode was not successful due to: ' + status);
            }
          };
        };

        directionsService.route({
          origin: origin1,
          destination: destinationA,
          travelMode: 'DRIVING'
        }, function (response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });


        for (let i = 0; i < originList.length; i++) {
          const results = response.rows[i].elements;
          geocoder.geocode({ 'address': originList[i] },
            showGeocodedAddressOnMap(false));
          for (let j = 0; j < results.length; j++) {
            geocoder.geocode({ 'address': destinationList[j] },
              showGeocodedAddressOnMap(true));
          }
        }
      }
    });
    this.interval = setInterval(() => {
      if (this.who === 'driver') {
        this.getDriverLocation(marker, maps);
      } else {
        console.log('update->');
        this.changeMyMarker(marker, maps);
      }
    }, 12000);
  }

  ionViewDidLeave() {
    console.log('leaved');
    clearInterval(this.interval);
  }

  changeMarkerPosition(marker, map) {
    const latlng = new google.maps.LatLng(this.driverLat, this.driverLng);
    map.setCenter(latlng);
    marker.setPosition(latlng);
  }

  changeMyMarker(marker, map) {
    const latlng = new google.maps.LatLng(this.myLat, this.myLng);
    map.setCenter(latlng);
    marker.setPosition(latlng);
  }

  ngOnInit() {
  }

}
