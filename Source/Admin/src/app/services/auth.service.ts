import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { ApisService } from './apis.service';
import { UtilService } from './util.service';
import { Store } from '../models/store.model';
import { StoresService } from './stores.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private api: ApisService,
    private util: UtilService,
    private storeService: StoresService
  ) {
    const _token = localStorage.getItem('access-token');
    let _user: any = '';
    if(_token != '' || _token != null) {
      _user = this.util.jwtDecode(_token);
    }
    
    //const isExpired = jwt.isTokenExpired(_token);
    this.userSubject = new BehaviorSubject<User>(_user);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username: string, password: string, callback) {
    this.api.post('galyon/v1/users/login', {
      uname: username,
      pword: password
    }).then((res: any) => {
      if(res && res.success == true && res.data) {
        localStorage.setItem('access-token', res.data);
        let decoded = this.util.jwtDecode(res.data);
        this.userSubject.next(decoded);
        this.user
        callback({ success: res.success, data: decoded });
      } else {
        callback({ success: res.success, message: res.message });
      }
      
    }).catch(error => {
      console.log('error', error);
      callback({ success: false, message: 'Something went wrong!' });
    });
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('access-token');
      this.userSubject.next(null);
      this.router.navigate(['/login']);
  }
  
  // isAuthenticated() {
  //   return this.authState.value;
  // }

  // login(uname, pword, cback) {
  //   this.api.post('galyon/v1/users/login', {
  //     uname: uname,
  //     pword: pword
  //   }).then((res: any) => {
  //     if(res && res.success === true) {
  //       localStorage.setItem('admin-user-email', res.data.email);
  //       localStorage.setItem('admin-user-role', res.data.role);
  //       localStorage.setItem('admin-user-token', res.data.token);
  //       this.authState.next(true);
  //       cback({ success: true });
  //     } else {
  //       this.authState.next(false);
  //       cback({ success: false, message: res.message });
  //     }
  //   }).catch(error => {
  //     console.log('error', error);
  //     this.authState.next(false);
  //     cback({ success: false, message: this.api.translate('Something went wrong') });
  //   });
  // }

  // verify(token, cback) {
  //   this.api.post('galyon/v1/users/verify', {
  //     token: token,
  //   }).then((res: any) => {
  //     if(res && res.success === true) {
  //       this.authState.next(true);
  //       cback({ success: true });
  //     } else {
  //       this.authState.next(false);
  //       cback({ success: false, message: res.message });
  //     }
  //   }).catch(error => {
  //     console.log('error', error);
  //     this.authState.next(false);
  //     cback({ success: false, message: this.api.translate('Something went wrong') });
  //   });
  // }

  // //Not callback
  // logouts(token, cback) {
  //   this.api.post('galyon/v1/users/logout', {
  //     token: token,
  //   }).then((res: any) => {
  //     if(res && res.success === true) {
  //       this.authState.next(true);
  //       cback({ success: true });
  //     } else {
  //       this.authState.next(false);
  //       cback({ success: false, message: res.message });
  //     }
  //   }).catch(error => {
  //     console.log('error', error);
  //     this.authState.next(false);
  //     cback({ success: false, message: this.api.translate('Something went wrong') });
  //   });
  // }
}
