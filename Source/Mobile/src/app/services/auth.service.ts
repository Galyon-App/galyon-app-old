import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { Store } from '../models/store.model';
import { UserService } from './user.service';
import { Token } from '../models/token.model';
import { Role } from '../models/role.model';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public static collectionName: string = 'users';
  private subject: BehaviorSubject<Token>;
  private observable: Observable<Token>;

  constructor(
    private router: Router,
    private api: ApiService,
    private util: UtilService,
    private userServ: UserService,
    private ngAuth: AngularFireAuth,
    private ngStore: AngularFirestore
  ) {
    const _token = localStorage.getItem(this.userServ.localKey);
    let token = new Token();
    if(_token != null && _token != '') {
      let token = this.util.jwtDecode(_token);
      //const isExpired = jwt.isTokenExpired(token);
    }
    this.subject = new BehaviorSubject<Token>(token);
    this.observable = this.subject.asObservable();

    ngAuth.onAuthStateChanged(user => {
      if(user) {
        const curUser = {
          uid: user.uid,
          email: user.email
        };

        ngStore.doc(
          `users/${curUser.uid}`
        ).set(curUser);
      }
    });
  }

  public get is_authenticated(): boolean {
    let token = localStorage.getItem(this.userServ.localKey);
    if(token == null || token == '') {
      return false;
    } else {
      return true;
    }
  }

  public get is_merchant(): boolean {
    return this.subject.value ? this.subject.value.role === Role.Merchant : false;
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

  public set setToken(_token: string) {
    localStorage.setItem(this.userServ.localKey, _token);
    let token = this.util.jwtDecode(_token);
    this.subject.next(token);
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

  firebaseSignIn() {
    this.ngAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  firebaseLogout() {
    this.ngAuth.signOut();
  }
}
