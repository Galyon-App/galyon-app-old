import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { Store } from '../models/store.model';
import { UserService } from './user.service';
import { Token } from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private subject: BehaviorSubject<Token>;
  private observable: Observable<Token>;

  constructor(
    private router: Router,
    private api: ApiService,
    private util: UtilService,
    private userServ: UserService
  ) {
    const _token = localStorage.getItem(this.userServ.localKey);
    if(_token != null && _token != '') {
      let token = this.util.jwtDecode(_token);
      //const isExpired = jwt.isTokenExpired(token);
      this.subject = new BehaviorSubject<Token>(token);
      this.observable = this.subject.asObservable();
    }
  }

  public get is_authenticated(): boolean {
    let token = localStorage.getItem(this.userServ.localKey);
    if(token == null || token == '') {
      return false;
    } else {
      return true;
    }
  }

  public get userToken(): Token {
    if(this.is_authenticated) {
      const _token = localStorage.getItem(this.userServ.localKey);
      if(_token != null && _token != '') {
        let token = this.util.jwtDecode(_token);
        this.subject.next(token);
      }
      return this.subject.value;
    } //TODO: Verify if okay to not return anything when nulled.
  }

  login(username: string, password: string, callback) {
    this.api.posts('galyon/v1/users/login', {
      uname: username,
      pword: password
    }).then((res: any) => {
      if(res && res.success == true && res.data) {
        localStorage.setItem(this.userServ.localKey, res.data);
        let decoded: Token = this.util.jwtDecode(res.data);
        this.subject.next(decoded);
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
      localStorage.removeItem(this.userServ.localKey);
      this.subject.next(null);
      this.router.navigate(['/login']);
  }
}
