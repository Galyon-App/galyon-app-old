import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private user: UserService,
    private auth: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // add auth header with jwt if user is logged in and request is to api url
    const user = this.auth.userToken;
    const isLoggedIn = user && user.logged_in;
    const isApiUrl = request.url.startsWith(environment.baseURL);
    if (isLoggedIn && isApiUrl) {
        request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${localStorage.getItem(this.user.localKey)}`,
              Basic: 'mobile'
            }
        });
    }

    return next.handle(request);
  }
}
