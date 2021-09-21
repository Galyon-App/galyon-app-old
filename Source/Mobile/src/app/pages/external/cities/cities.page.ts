/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { CartService } from 'src/app/services/cart.service';
import { CityService } from 'src/app/services/city.service';
import { City } from 'src/app/models/city.model';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.page.html',
  styleUrls: ['./cities.page.scss'],
})
export class CitiesPage {

  id: any;
  clicked: boolean;
  dummy = Array(10);
  cities: City[] = [];

  terms: any = '';
  
  constructor(
    public api: ApiService,
    public util: UtilService,
    private navCtrl: NavController,
    public cart: CartService,
    private city: CityService
  ) {
    this.clicked = false;
    const id = this.city.activeCity;
    if (id && id !== null && id !== '') {
      this.id = id;
    } 
    this.getCities();
  }

  limit_start: number = 0;
  limit_length: number = 15;
  no_stores_follows: boolean = false;

  getCities(event = null) {
    this.api.post('galyon/v1/cities/getAllCities', {
      filter_term: this.terms,
      limit_start: this.limit_start,
      limit_length: this.limit_length
    }).subscribe((response: any) => {
      if (response && response.success && response.data) {

        if(this.cities.length > 0) {
          response.data.forEach(element => {
            if(element.status === '1') {
              this.cities.push(element);
            }
          });
        } else {
          this.cities = response.data.filter(x => x.status === '1');
          this.dummy = [];
        }
      } else {
        this.no_stores_follows = true;
        this.util.errorToast(this.util.getString('No Cities Found'));
      }
      if(event) {
        event.complete();
      }
    }, error => {
      if(event) {
        event.complete();
      }
      console.log('error', error);
      this.dummy = [];
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  ionViewDidEnter() {
    console.log('enter');
  }

  selected() {
    this.clicked = true;
    this.city.setActiveCity(this.id);
    const city: City[] = this.cities.filter(x => x.uuid === this.id);
    this.city.setCurrent(city[0]);
    this.cart.clearCart();

    const param: NavigationExtras = {
      queryParams: {
        action: "refresh"
      }
    };
    this.navCtrl.navigateRoot(['user/home'], param);
  }

  loadData(event) {
    this.limit_start += this.limit_length;
    this.getCities(event.target);
  }

  onSearchChange(event) {
    this.search(this.terms);
  }

  search(event: string) {
    this.id = '';
    this.clicked = false;

    if (event && event !== '') {
      this.api.post('galyon/v1/cities/getAllCities', {
        filter_term: event,
        limit_start: 0,
        limit_length: 15
      }).subscribe((response: any) => {
        if (response && response.success && response.data) {
          this.cities = response.data.filter(x => x.status === '1');
          this.dummy = [];
        }
      }, error => {
        console.log(error);
      });
    }
  }

}
