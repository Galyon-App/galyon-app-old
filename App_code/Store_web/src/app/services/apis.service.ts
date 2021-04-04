/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
export class AuthInfo {
  constructor(public $uid: string) { }

  isLoggedIn() {
    return !!this.$uid;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApisService {
  static UNKNOWN_USER = new AuthInfo(null);
  public authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(ApisService.UNKNOWN_USER);
  baseUrl: any = '';
  mediaURL: any = '';
  constructor(
    private http: HttpClient,
  ) {
    this.baseUrl = environment.baseURL;
    this.mediaURL = environment.mediaURL;
  }

  translate(str) {
    return str;
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


  sendNotification(msg, title) {
    const body = {
      app_id: environment.onesignal.appId,
      included_segments: ['Active Users', 'Inactive Users"'],
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

  sendNotification2(msg, title, id) {
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

  public post(url, body): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Basic', `${environment.authToken}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        resolve(error);
      });
      // return this.http.post(this.baseUrl + url, param, header);
    });
  }

  public get(url): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Basic', `${environment.authToken}`)
        // .set('responseType', 'blob')
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        resolve(error);
      });
    });
  }

  public externalGet(url): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Basic', `${environment.authToken}`)
      };
      this.http.get(url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        resolve(error);
      });
    });
  }
}
