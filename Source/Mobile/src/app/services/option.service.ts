import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Option } from '../models/option.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class OptionService {

  private date_init = new Date(); 
	private date_new = new Date(); 
  
  public has_fresh_data(timer: number = 10000) {
    this.date_new = new Date(); 
    let counting = (this.date_new.getTime() - this.date_init.getTime())/1000; 
    if(counting > timer) {
      this.date_init = new Date(); 
      
    } return counting > timer ? true : false;
  }

  private subject: BehaviorSubject<Option>;
  private observable: Observable<Option>;

  public get current(): Option {
    return this.subject.value;
  }

  public get observe(): Observable<Option> {
    return this.observable;
  }

  public setCurrent = (cur: Option) => {
    this.subject.next(cur);
  }

  constructor(
    private api: ApiService,
  ) { 
    //TODO: Get the data from localdatabase then load.
    let instance = new Option();
    this.subject = new BehaviorSubject<Option>(instance);
    this.observable = this.subject.asObservable();
  }

  public request(callback = null) {
    if(this.has_fresh_data()) {
      if(callback != null) {
        callback(this.current);
      }
    } else {
      this.api.gets('galyon/v1/settings/initialize').then((res: any) => {
        if(res && res.success == true && res.data) {
          this.subject.next(res.data);
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
