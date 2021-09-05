import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { Store } from '../models/store.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private api: ApiService,
    private util: UtilService
  ) {
    const _token = localStorage.getItem('access-token');
    let _user = this.util.jwtDecode(_token);
    //const isExpired = jwt.isTokenExpired(_token);
    this.userSubject = new BehaviorSubject<User>(_user);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username: string, password: string, callback) {
    this.api.posts('galyon/v1/users/login', {
      uname: username,
      pword: password
    }).then((res: any) => {
      if(res && res.success == true && res.data) {
        localStorage.setItem('access-token', res.data);
        let decoded = this.util.jwtDecode(res.data);
        this.userSubject.next(decoded);
        if(decoded.role == 'store') {
          //this.storeService.getStoreByOwner(decoded.uuid);
        }
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
}
