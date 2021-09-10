import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '../models/store.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private date_init = new Date(); 
	private date_new = new Date(); 
  
  public has_fresh_data(timer: number = 10000) {
    this.date_new = new Date(); 
    let counting = (this.date_new.getTime() - this.date_init.getTime())/1000; 
    if(counting > timer) {
      this.date_init = new Date(); 
      
    } return counting > timer ? true : false;
  }

  private subject: BehaviorSubject<Store[]>;
  private observable: Observable<Store[]>;

  public get current(): Store[] {
    return this.subject.value;
  }

  public setCurrent = (cur: Store[]) => {
    this.subject.next(cur);
  }

  constructor(
    private api: ApiService,
  ) { 
    //TODO: Get the data from localdatabase then load.
    let instance = Store[0];
    this.subject = new BehaviorSubject<Store[]>(instance);
    this.observable = this.subject.asObservable();
  }

  public request(callback = null) {
    if(this.has_fresh_data()) {
      if(callback != null) {
        callback(this.current);
      }
    } else {
      this.api.gets('galyon/v1/stores/getAllStores').then((res: any) => {
        if(res && res.success == true && res.data) {
          this.subject = new BehaviorSubject<Store[]>(res.data);
        }
        if(callback != null) {
          callback(res.success ? this.current : null);
        }
      }).catch(error => {
        console.log('error', error);
        if(callback != null) {
          callback(null);
        }
      });
    }
  }
}
