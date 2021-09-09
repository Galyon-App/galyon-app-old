/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
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
  translations: any[] = [];
  constructor(
    private http: HttpClient,
  ) {
    this.baseUrl = environment.baseURL;
    this.mediaURL = environment.mediaURL;
  }

  translate(str) {
    if (this.translations[str]) {
      return this.translations[str];
    }
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

  public autoselect(url, body) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Basic', `${environment.authToken}`)
    };
    const param = this.JSON_to_URLEncoded(body);
    return this.http.post(this.baseUrl + url, param, header).pipe(
      response => response[1]
    );
  }

  search(term: string, url: any) {
    if (term === '') {
      return of([]);
    }

    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Basic', `${environment.authToken}`)
    };
    
    const param = this.JSON_to_URLEncoded({
      search: term
    });

    return this.http
      .post<any>(this.baseUrl + url, param, header).pipe(
        map(response => {
          response.data.forEach(element => {
            element.cover = environment.mediaURL + element.cover;
          });
          return response.data;
        })
      );
  }

  // search(term: string) {
  //   if (term === '') {
  //     return of([]);
  //   }

  //   let PARAMS = new HttpParams({
  //     fromObject: {
  //       action: 'opensearch',
  //       format: 'json',
  //       origin: '*'
  //     }
  //   });

  //   return this.http
  //     .get<[any, string[]]>('https://en.wikipedia.org/w/api.php', {params: PARAMS.set('search', term)}).pipe(
  //       map(response => response[1])
  //     );
  // }

  // public auth(body): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     const header = {
  //       headers: new HttpHeaders()
  //         .set('Content-Type', 'application/x-www-form-urlencoded')
  //         .set('Basic', `${environment.authToken}`)
  //     };
  //     const param = this.JSON_to_URLEncoded(body);
  //     console.log(param);
  //     this.http.post(this.baseUrl + 'users/getById', param, header).subscribe((data: any) => {
  //       console.log(data);
  //       if (data && data.status === 200 && data.data && data.data.length) {
  //         if (data && data.data[0] && data.data[0].type && data.data[0].type === 'admin') {
  //           resolve(true);
  //         } else {
  //           resolve(false);
  //         }
  //       } else {
  //         resolve(false);
  //       }
  //     }, error => {
  //       resolve(error);
  //     });
  //   });
  // }

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
