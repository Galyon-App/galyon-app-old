/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private date_init = new Date(); 
	private date_new = new Date(); 
  
  public has_fresh_data(timer: number = 10000) {
    this.date_new = new Date(); 
    let counting = (this.date_new.getTime() - this.date_init.getTime())/1000; 
    if(counting > timer) {
      this.date_init = new Date(); 
      
    } return counting > timer ? true : false;
  }

  private subject: BehaviorSubject<Product[]>;
  private observable: Observable<Product[]>;

  public get current(): Product[] {
    return this.subject.value;
  }

  public setCurrent = (cur: Product[]) => {
    this.subject.next(cur);
  }

  constructor(
    private api: ApiService,
  ) { 
    //TODO: Get the data from localdatabase then load.
    let instance = Product[0];
    this.subject = new BehaviorSubject<Product[]>(instance);
    this.observable = this.subject.asObservable();
  }

  public request(params: any, callback = null, persist: boolean = true) {
    if(this.has_fresh_data()) {
      if(callback != null) {
        callback(this.current);
      }
    } else {
      this.api.posts('galyon/v1/products/getAllProducts', params).then((res: any) => {
        if(res && res.success == true && res.data && persist) {
          this.subject = new BehaviorSubject<Product[]>(res.data);
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

  public getById(product_id: string, callback = null) {
    this.api.posts('galyon/v1/products/getProductById', {
      uuid: product_id
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
