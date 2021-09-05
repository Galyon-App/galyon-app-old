import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApisService } from '../services/apis.service';

@Injectable({
  providedIn: 'root'
})
export class SetupGuard implements CanActivate {

  constructor(
    public api: ApisService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): any {
    return this.api.get('galyon/v1/settings/initialize/verify').then((response: any) => {
      if (response && response.success == true && response.data ) {
        return true;
      } else {
        this.router.navigate(['/setup']);
      }
    }).catch(error => {
      this.router.navigate(['/setup']);
    });
  }
}
