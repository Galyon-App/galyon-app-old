/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApisService } from './services/apis.service';
import { UtilService } from './services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
    private router: Router,
    public api: ApisService,
    public util: UtilService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  initializeApp() {
    const lng = localStorage.getItem('language');
    if (!lng || lng === null) {
      this.api.get('users/getDefaultSettings').then((data: any) => {
        console.log('----------------- app setting', data);
        if (data && data.status === 200 && data.data) {
          const manage = data.data.manage;
          const language = data.data.lang;

          if (language) {
            this.api.translations = language;
            localStorage.setItem('language', data.data.file);
          }
          const settings = data.data.settings;
          if (settings && settings.length > 0) {
            const info = settings[0];
            this.util.cside = info.currencySide;
            this.util.currecny = info.currencySymbol;
          } else {
            this.util.cside = 'right';
            this.util.currecny = '$';
          }
          const general = data.data.general;
          console.log('generalllll============================>', general)
          if (general && general.length > 0) {
            const info = general[0];
            this.util.general = info;
          }
        }
      }, error => {
        console.log('default settings', error);
      });
    } else {
      const param = {
        id: localStorage.getItem('language')
      };
      this.api.post('users/getDefaultSettingsById', param).then((data: any) => {
        console.log('----------------- app setting', data);
        if (data && data.status === 200 && data.data) {
          const manage = data.data.manage;
          const language = data.data.lang;

          if (language) {
            this.api.translations = language;
          }
          const settings = data.data.settings;
          if (settings && settings.length > 0) {
            const info = settings[0];
            this.util.cside = info.currencySide;
            this.util.currecny = info.currencySymbol;

          } else {
            this.util.cside = 'right';
            this.util.currecny = '$';
          }
          const general = data.data.general;
          console.log('generalllll============================>', general)
          if (general && general.length > 0) {
            const info = general[0];
            this.util.general = info;

          }
        }
      }, error => {
        console.log('default settings by id', error);
        this.util.cside = 'right';
        this.util.currecny = '$';
      });
    }
    this.getLangs();
  }

  getLangs() {
    this.api.get('lang').then((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        const info = data.data.filter(x => x.status === '1');
        this.util.languages = info;
        this.util.ejectLangs();
      }
    }, error => {
      console.log(error);
    });
  }
}
