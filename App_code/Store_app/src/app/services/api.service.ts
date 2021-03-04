/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl: any = '';
  mediaURL: any = '';
  constructor(
    private http: HttpClient,
    private nativeHttp: HTTP
  ) {
    this.baseUrl = environment.baseURL;
    this.mediaURL = environment.mediaURL;
  }


  alerts(title, message, type) {
    Swal.fire(
      title,
      message,
      type
    );
  }

  uploadFile(files: File[]) {
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('userfile', f));
    return this.http.post(this.baseUrl + 'users/upload_image', formData);
  }

  getCurrencyCode() {
    return environment.general.code;
  }

  getCurrecySymbol() {
    return environment.general.symbol;
  }


  sendNotification(msg, title, id) {
    const body = {
      app_id: environment.onesignal.appId,
      include_player_ids: [id],
      headings: { en: title },
      contents: { en: msg },
      data: { task: msg }
    };
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Basic ${environment.onesignal.restKey}`)
    };
    return this.http.post('https://onesignal.com/api/v1/notifications', body, header);
  }

  JSON_to_URLEncoded(element, key?, list?) {
    let new_list = list || [];
    if (typeof element === 'object') {
      for (let idx in element) {
        this.JSON_to_URLEncoded(
          element[idx],
          key ? key + '[' + idx + ']' : idx,
          new_list
        );
      }
    } else {
      new_list.push(key + '=' + encodeURIComponent(element));
    }
    return new_list.join('&');
  }


  post(url, body) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Basic', `${environment.authToken}`)
    };
    const param = this.JSON_to_URLEncoded(body);
    console.log(param);
    return this.http.post(this.baseUrl + url, param, header);
  }

  get(url) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Basic', `${environment.authToken}`)
    };
    return this.http.get(this.baseUrl + url, header);
  }

  externalGet(url) {
    return this.http.get(url);
  }

  nativePost(url, post) {
    console.log(this.baseUrl + url, post);
    return this.nativeHttp.post(this.baseUrl + url, post, {
      Basic: `${environment.authToken}`
    });
  }
}
