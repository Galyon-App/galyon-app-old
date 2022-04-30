import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApisService } from '../services/apis.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InitGuard implements CanActivate {
  constructor(
    public api: ApisService,
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): any {
    return this.api.get('galyon/v1/settings/initialize/verify').then((response: any) => {
      if (response && response.success == true && response.data ) {
        const user = this.auth.userValue;  
        if (user) {
          this.router.navigate(['/']);
        }
        return true;
      } else {
        this.router.navigate(['/setup']);
      }
    }).catch(error => {
      this.router.navigate(['/setup']);
    });
  }
}
