/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  email: any = '';
  password: any = '';
  selected: any;
  langs: any[] = [];
  constructor(
    private router: Router,
    public api: ApisService,
    public util: UtilService,
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
  ) { }

  login() {
    if (!this.email || this.email === '' || !this.password || this.password === '') {
      this.util.error('All Fields are required');
      return false;
    }

    // const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    // if (!emailfilter.test(this.email)) {
    //   this.util.error('Please enter valid email');
    //   return false;
    // }
    this.spinner.show();

    this.auth.login(this.email, this.password, (response) => {
      if(response && response.success == true && response.data) {
        // get return url from query parameters or default to home page
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.util.error( response.message );
      }
      this.spinner.hide();
    });
  }
}
