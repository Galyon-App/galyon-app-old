import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private api: ApiService
  ) { }

  public submitOrder(params: any) {
    const response = () => new Promise((resolve, reject) => {
      this.api.posts('galyon/v1/orders/createNewOrder', params).then((res: any) => {
        resolve(res.success ? res.data:null);
      }).catch(error => {
        console.log('error', error);
        reject(null);
      });
    });
    return response();
  }
}
