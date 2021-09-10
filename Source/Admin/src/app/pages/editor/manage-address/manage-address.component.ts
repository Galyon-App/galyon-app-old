import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MouseEvent } from '@agm/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AddressService } from 'src/app/services/address.service';
declare var google: any;

// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}

@Component({
  selector: 'app-manage-address',
  templateUrl: './manage-address.component.html',
  styleUrls: ['./manage-address.component.scss']
})
export class ManageAddressComponent implements OnInit {

  new: boolean = true;
  location: any = ''; //address
  address: any = ''; //house
  landmark: any = '';
  zipcode: any = '';
  title: any = 'other';

  markers: marker[] = [];
  mapStyle: any[] = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ];
  markerIcon: any = {
    url: true ? './assets/images/marker.png' : './assets/images/marker.png',
    scaledSize: {
        width: 60,
        height: 60
    }
  };
  mapOrigin: any = {
    lat: 0.0,
    lng: 0.0,
  };
  mapZoom: number = 16;
  bounderyRestrictions = {
    latLngBounds: {
      east: 10.49234,
      north: 47.808455,
      south: 45.81792,
      west: 5.95608
    },
    strictBounds: true
  };

  searching: any = '';
  owner_id: any = '';
  address_id: any = '';
  address_type: any = '';

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApisService,
    private util: UtilService,
    private router: Router,
    public route: ActivatedRoute,
    private navCtrl: Location,
    private addressServ: AddressService
  ) { 
    this.mapOrigin.lat = 14.3222697;
    this.mapOrigin.lng = 121.0449656;
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.uuid && data.from) {
        this.address_type = data.from;
        this.owner_id = data.uuid;
        this.address_id = data.address_id ? data.address_id : null;
        this.new = data.address_id ? false : true;

        let query: any;
        if(this.address_type == 'store') {
          query = {
            store_id: this.owner_id
          };
        } else if(this.address_type == 'user') {
          query = {
            user_id: this.owner_id
          };
        }
        this.addressServ.getById(query, (response) => {
          if(response) {
            this.address = response.address;
            this.landmark = response.landmark;
            this.zipcode = response.zipcode;
            this.mapOrigin.lat = +response.lat;
            this.mapOrigin.lng = +response.lng;
            this.processLocation();
          } else {
            this.tryGetCurrentLocation();
          }
        });
        //Get the current location form address id.
      } else {
        this.tryGetCurrentLocation();
      }
    });
  }

  ngOnInit(): void {
  }

  mapClicked($event: MouseEvent) {
    //console.log($event.coords);
    // this.markers.push({
    //   lat: $event.coords.lat,
    //   lng: $event.coords.lng,
    //   draggable: true
    // });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    //console.log('dragEnd', m, $event);
    const geocoder = new google.maps.Geocoder;
    //let query = { address: this.address };
    let query = { location: $event.coords };
    console.log(query);
    geocoder.geocode(query, (results, status) => {
      if (status === 'OK' && results && results.length) {
        this.location = results[0].formatted_address;
        this.mapOrigin.lat = results[0].geometry.location.lat();
        this.mapOrigin.lng = results[0].geometry.location.lng();
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
        return false;
      }
    });
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  tryGetCurrentLocation() {
    //Trigger the platform to ask for location.
    navigator.geolocation.getCurrentPosition((position) => {});
    
    //Check if denied.
    navigator.permissions.query({ name: 'geolocation' })
      .then( (response) => {
          if(response.state == 'granted') {
            navigator.geolocation.getCurrentPosition((position) => {
              this.mapOrigin.lat = position.coords.latitude;
              this.mapOrigin.lng = position.coords.longitude;
              this.processLocation();
            });
          } else {
            this.processLocation();
          }
      });
  }

  processLocation() {
    this.markers.push({
      lat: this.mapOrigin.lat,
      lng: this.mapOrigin.lng,
      draggable: true
    });

    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({
      location: {
        lat: this.mapOrigin.lat,
        lng: this.mapOrigin.lng
      }
    }, (results, status) => {
      if (status === 'OK' && results && results.length) {
        this.location = results[0].formatted_address;
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
        return false;
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  create() {
    this.addressServ.create({
      uid: this.address_type == 'user' ? this.owner_id : null,
      store_id: this.address_type == 'store' ? this.owner_id : null,
      address: this.location,
      house: this.address,
      landmark: this.landmark,
      zipcode: this.zipcode,
      lat: this.mapOrigin.lat,
      lng: this.mapOrigin.lng,
      type: 'other'
    }, null);
  }

  update() {
    this.addressServ.update({
      uuid: this.address_id,
      uid: this.address_type == 'user' ? this.owner_id : null,
      store_id: this.address_type == 'store' ? this.owner_id : null,
      address: this.location,
      house: this.address,
      landmark: this.landmark,
      zipcode: this.zipcode,
      lat: this.mapOrigin.lat,
      lng: this.mapOrigin.lng,
      type: 'other'
    }, null);
  }

  onSearch() {
    console.log(this.searching);
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({
      address: this.searching
    }, (results, status) => {
      if (status === 'OK' && results && results.length) {
        console.log(results);
        this.location = results[0].formatted_address;
        this.mapOrigin.lat = results[0].geometry.location.lat();
        this.mapOrigin.lng = results[0].geometry.location.lng();
        this.markers[0].lat = this.mapOrigin.lat;
        this.markers[0].lng = this.mapOrigin.lng;
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
        return false;
      }
    });
  }
}
