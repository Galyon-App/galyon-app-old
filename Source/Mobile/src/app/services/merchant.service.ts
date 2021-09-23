import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Store } from '../models/store.model';
import * as moment from 'moment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  private subject: BehaviorSubject<Store[]>;
  private observable: Observable<Store[]>;

  public get stores(): Store[] {
    return this.subject.value;
  }

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) { 
    let instance = [] as Store[];
    this.subject = new BehaviorSubject<Store[]>(instance);
    this.observable = this.subject.asObservable();
  }

  public clearData() {
    let cleared = [] as Store[];
    this.subject.next(cleared);
  }

  public isOpen(start, end) {
    const format = 'H:mm:ss';
    const ctime = moment().format('HH:mm:ss');
    const time = moment(ctime, format);
    const beforeTime = moment(start, format);
    const afterTime = moment(end, format);

    if (time.isBetween(beforeTime, afterTime)) {
      return true;
    }
    return false
  }

  public request(callback = null, persist: boolean = true) {
    this.api.posts('galyon/v1/stores/getStoreByOwner', {
      uuid: this.auth.userToken.uuid
    }).then((res: any) => {
      if(res && res.success == true && res.data) {
        if(persist) {
          this.subject.next(res.data);
        }
      }
      if(callback != null) {
        callback(res.success ? this.stores : null);
      }
    }).catch(error => {
      console.log('error', error);
      if(callback != null) {
        callback(null);
      }
    });
  }

  public getById(store_id: string, callback = null) {
    this.api.posts('galyon/v1/stores/getStoreById', {
      uuid: store_id
    }).then((res: any) => {
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
