import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '../models/store.model';
import { ApisService } from './apis.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoresService {

  private localKey: string = 'merchant-stores';
  private storeSubject: BehaviorSubject<Store>;
  public store: Observable<Store>;

  private subjectList: BehaviorSubject<Store[]>;
  private observableList: Observable<Store[]>;

  public get current(): Store[] {
    return this.subjectList.value;
  }

  constructor(
    private api: ApisService,
    private authService: AuthService
  ) { 
    const _lists = localStorage.getItem(this.localKey);
    let _stores = JSON.parse(_lists);
    this.storeSubject = new BehaviorSubject<Store>(_stores);
    this.store = this.storeSubject.asObservable();
  }

  public get storeValue(): Store {
    return this.storeSubject.value;
  }

  getStoreByOwner(storeOwner: any) {
    this.api.post('galyon/v1/stores/getStoreByOwner', { uuid: storeOwner }).then((res: any) => {
      if(res && res.success == true && res.data) {
        localStorage.setItem(this.localKey, JSON.stringify(res.data));
        this.storeSubject.next(res.data);
      }
    }).catch(error => {
      console.log('error', error);
    });
  }

  public request(callback = null) {
    this.api.get('galyon/v1/stores/getAllStores').then((res: any) => {
      if(res && res.success == true && res.data) {
        this.subjectList = new BehaviorSubject<Store[]>(res.data);
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

  getStoreById(storeId: any = '', callback = null) {
    this.api.post('galyon/v1/stores/getStoreById', {
      uuid: storeId
    }).then((res: any) => {
      if(res && res.success == true && res.data) {
        this.subjectList = new BehaviorSubject<Store[]>(res.data);
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
