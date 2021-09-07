import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { ApiService } from './api.service';
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
    private api: ApiService,
  ) {
    let curUser = new User();
    this.subject = new BehaviorSubject<User>(curUser);
    this.observable = this.subject.asObservable();
  }
}
