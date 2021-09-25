/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ApisService } from 'src/app/services/apis.service';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-manage-city',
  templateUrl: './manage-city.component.html',
  styleUrls: ['./manage-city.component.scss']
})
export class ManageCityComponent {

  city: any;
  province: any;
  country: any;
  lat: any;
  lng: any;
  address: any;

  constructor(
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private util: UtilService,
    private router: Router
  ) { }

  public handleAddressChange(address: Address) {
    if(address) {
      this.city = address.name;
      address.address_components.forEach(item => {
        if(item.types.includes('administrative_area_level_2')) {
          this.province = item.long_name;
        }
        if(item.types.includes('administrative_area_level_1')) {
          this.province = this.province == '' ? item.long_name : this.province +', '+ item.long_name;
        }
        if(item.types.includes('country')) {
          this.country = item.long_name;
        }        
      });
      this.lat = address.geometry.location.lat();
      this.lng = address.geometry.location.lng();
    }
  }

  create() {
    if (!this.city || this.city === '' || !this.lat || !this.lng) {
      this.util.error(this.api.translate('Please select valid city name'));
      return false;
    }

    this.spinner.show();
    this.api.post('galyon/v1/cities/createNewCity', {
      name: this.city,
      province: this.province,
      country: this.country,
      lat: this.lat,
      lng: this.lng
    }).then(data => {
      this.spinner.hide();
      this.navCtrl.back();
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    });
  }
}
