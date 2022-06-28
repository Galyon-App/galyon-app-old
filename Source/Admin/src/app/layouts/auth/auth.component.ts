/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Role } from 'src/app/models/role.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if( this.authService.IsAuthenticated ) {
      const role = this.authService.userValue.role;
      if( role == Role.Admin ) {
        this.router.navigate(['/admin']);
      } else if( role == Role.Merchant ) {
        this.router.navigate(['/merchant']);
      } else if( role == Role.Operator ) {
        this.router.navigate(['/operator']);
      } else {
        this.router.navigate(['/forbidden']);
      }
    }
  }

  ngOnInit() {
  }

}
