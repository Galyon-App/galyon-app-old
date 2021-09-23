import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Address } from '../models/address.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private addressLocalKey: any = 'mobile-current-address';
  public get localKey(): string {
    return this.addressLocalKey;
  }

  private subject: BehaviorSubject<Address[]>;
  private observable: Observable<Address[]>;

  public get current(): Address[] {
    return this.subject.value;
  }

  public setCurrent = (cur: Address[]) => {
    this.subject.next(cur);
  }

  public setActiveAddress(uuid: string = '') {
    localStorage.setItem(this.localKey, uuid);
  }

  public get activeAddress(): string {
    let current_address = localStorage.getItem(this.localKey);
    if(current_address == null || current_address == '') {
      return null;
    }
    return current_address;
  }

  constructor(
    private api: ApiService,
  ) { 
    let instance = [] as Address[];
    this.subject = new BehaviorSubject<Address[]>(instance);
    this.observable = this.subject.asObservable();
  }

  public request(userId, callback = null) {
    this.api.posts('galyon/v1/address/getByUser', {
      uuid: userId,
    }).then((res: any) => {
      if(res && res.success == true && res.data) {
        this.subject.next(res.data)
      }
      if(callback != null) {
        callback(res.success);
      }
    }).catch(error => {
      console.log('error', error);
      if(callback != null) {
        callback(null);
      }
    });
  }

  public getByStore(store_id: string) {
    const response = () => new Promise((resolve, reject) => {
      this.api.posts('galyon/v1/address/getByStore', {
        store_id: store_id
      }).then((res: any) => {
        resolve(res.success ? res.data:null);
      }).catch(error => {
        console.log('error', error);
        reject(null);
      });
    });
    return response();
  }
}
