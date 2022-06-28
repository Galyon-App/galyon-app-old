/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApisService } from './services/apis.service';
import { UtilService } from './services/util.service';
import { AuthService } from './services/auth.service';
import { Role } from './models/role.model';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  user: User;

  constructor(
    private router: Router,
    public api: ApisService,
    public util: UtilService,
    private auth: AuthService
  ) {
    this.auth.user.subscribe(curUser => {
      if(curUser) {
        this.user = curUser;
        this.setup();
      }
    });
  }

  get isAdmin() {
    return this.user && this.user.role === Role.Admin;
  }

  logout() {
      this.auth.logout();
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  setup() {
    this.api.get('galyon/v1/settings/initialize').then((response: any) => {
      if (response && response.success == true && response.data) {
        //const manage = response.data.manage;
        this.api.translations = response.data.lang;
        localStorage.setItem('language', response.data.file);

        const settings = response.data.settings;
        this.util.currecny = settings.currencySymbol;
        this.util.cside = settings.currencySide;
          
        const general = response.data.general;
        this.util.general = general;
      }
    }, error => {
      console.log('app init error', error);
    });
  }
}
