import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Address } from '../models/address.model';
import { ApisService } from './apis.service';
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
    private api: ApisService,
  ) { 
    let instance = Address[0];
    this.subject = new BehaviorSubject<Address[]>(instance);
    this.observable = this.subject.asObservable();
  }

  public request(userId, callback = null) {
    this.api.post('galyon/v1/address/getByUser', {
      uuid: userId,
    }).then((res: any) => {
      if(res && res.success == true && res.data) {
        this.subject = new BehaviorSubject<Address[]>(res.data);
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

  /**
   * 
   * @param query uuid, owner, store_id
   * @param callback 
   */
  public getById(query, callback = null) {
    this.api.post('galyon/v1/address/getByID', query).then((res: any) => {
      if(callback != null) {
        callback(res.success ? res.data : null);
      }
    }).catch(error => {
      console.log('error', error);
      if(callback != null) {
        callback(null);
      }
    });
  }

  public create(params, callback = null) {
    this.api.post('galyon/v1/address/createNewAddress', params).then((res: any) => {
      if(callback != null) {
        callback(res.success ? res.data : null);
      }
    }).catch(error => {
      console.log('error', error);
      if(callback != null) {
        callback(null);
      }
    });
  }

  public update(params, callback = null) {
    this.api.post('galyon/v1/address/editAddresssCurrent', params).then((res: any) => {
      if(callback != null) {
        callback(res.success ? res.data : null);
      }
    }).catch(error => {
      console.log('error', error);
      if(callback != null) {
        callback(null);
      }
    });
  }
}
