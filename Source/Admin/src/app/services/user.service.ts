import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { Users } from '../models/users.model';
import { ApisService } from './apis.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userLocalKey: any = 'access-token';
  public get localKey(): string {
    return this.userLocalKey;
  }

  private subject: BehaviorSubject<User>;
  private observable: Observable<User>;

  public get getCurrent(): User {
    return this.subject.value;
  }

  public setCurrent = (cur: User) => {
    this.subject.next(cur);
  }

  constructor(
    private api: ApisService,
  ) {
    let curUser = new User();
    this.subject = new BehaviorSubject<User>(curUser);
    this.observable = this.subject.asObservable();
  }

  public request(user_id: string = "", callback = null) {
    this.api.post('galyon/v1/users/getByID', {
      uuid: user_id
    }).then((response: any) => {
      if (response && response.success == true && response.data) {
        let curUser: User = response.data;
        this.setCurrent(curUser);
      }
      if(callback != null) {
        callback(response.success);
      }
      
    }, error => {
      console.log('app get user error', error);
      if(callback != null) {
        callback(false);
      }
    });
  }

  public search(search: any='', callback = null) {
    this.api.post('galyon/v1/users/getAll', {
      search: search
    }).then((response: any) => {
      if (response && response.success == true && response.data) {
        let filteredUsers: Users[] = response.data;
        callback(filteredUsers);
      }
      if(callback != null) {
        callback(response.success);
      }
      
    }, error => {
      console.log('app get user error', error);
      if(callback != null) {
        callback(false);
      }
    });
  }
}
