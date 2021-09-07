import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { City } from '../models/city.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private cityLocalKey: any = 'mobile-current-city';
  public get localKey(): string {
    return this.cityLocalKey;
  }

  private subject: BehaviorSubject<City>;
  private observable: Observable<City>;

  public get current(): City {
    return this.subject.value;
  }

  public setCurrent = (cur: City) => {
    console.log('city', cur);
    this.subject.next(cur);
  }

  public setActiveCity(uuid: string = '') {
    localStorage.setItem(this.localKey, uuid);
  }

  public get activeCity(): string {
    let current_city = localStorage.getItem(this.localKey);
    if(current_city == null || current_city == '') {
      return null;
    }
    return current_city;
  }

  constructor(
    private api: ApiService
  ) { 
    let curUser = new City();
    this.subject = new BehaviorSubject<City>(curUser);
    this.observable = this.subject.asObservable();
  }

  public getActiveCity(callback) {
    this.api.posts('galyon/v1/cities/getCityById', {
      uuid: this.activeCity,
    }).then((res: any) => {
      if(res && res.success == true && res.data) {
        this.subject = new BehaviorSubject<City>(res.data);
        callback(res.data);
      } else {
        console.log('error', res.message);
        callback(null);
      }
    }).catch(error => {
      console.log('error', error);
      callback(null);
    });
  }
}
