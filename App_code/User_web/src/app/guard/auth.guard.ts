/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authServ: ApiService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): any {
    /// Less Secure but faster
    const uid = localStorage.getItem('uid');
    console.log('uid', localStorage.getItem('uid'));
    if (uid && uid != null && uid !== 'null') {
      return true;
    }
    this.router.navigate(['/login']);
  }
}
