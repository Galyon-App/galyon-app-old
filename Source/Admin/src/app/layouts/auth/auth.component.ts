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
    const role = this.authService.userValue.role;
    if(role == Role.Admin) {
      this.router.navigate(['/admin']);
    } else if(role == Role.Merchant) {
      this.router.navigate(['/merchant']);
    } else {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
  }

}
