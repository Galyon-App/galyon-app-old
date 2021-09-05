/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    // const role = authService.userValue.role;
    // if(role == Role.Merchant) {
    //   this.router.navigate(['/merchant']);
    // } else if(role == Role.Driver) {
    //   this.router.navigate(['/driver']);
    // } else if(role == Role.User) {
    //   this.router.navigate(['/user']);
    // } else {
    //   localStorage.clear();
    //   this.router.navigate(['/login']);
    // }
  }

  ngOnInit() {
  }

}
