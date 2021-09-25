import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { City } from '../models/city.model';
import { ApisService } from './apis.service';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private cityLocalKey: any = 'admin-current-city';
  public get localKey(): string {
    return this.cityLocalKey;
  }

  private subject: BehaviorSubject<City[]>;
  private observable: Observable<City[]>;

  public get current(): City[] {
    return this.subject.value;
  }

  public setCurrent = (cur: City[]) => {
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
    private api: ApisService
  ) { 
    let curUser: City[] = [];
    this.subject = new BehaviorSubject<City[]>(curUser);
    this.observable = this.subject.asObservable();
  }

  public getCityId(city_id: string = '', callback = null) {
    this.api.post('galyon/v1/cities/getCityById', {
      uuid: city_id,
    }).then((res: any) => {
      if(res && res.success == true && res.data) {
        res.data.name = res.data.name ? res.data.name : "Unknown";
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

  public request(callback = null) {
    this.api.get('galyon/v1/cities/getAllCities').then((res: any) => {
      if(res && res.success == true && res.data) {
        this.subject = new BehaviorSubject<City[]>(res.data);
        if(callback != null) {
          callback(res.data);
        }
      } else {
        console.log('error', res.message);
        if(callback != null) {
          callback(null);
        }
      }
    }).catch(error => {
      console.log('error', error);
      if(callback != null) {
        callback(null);
      }
    });
  }
}
