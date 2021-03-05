/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.page.html',
  styleUrls: ['./languages.page.scss'],
})
export class LanguagesPage implements OnInit {

  dummy: any[] = [];
  langs: any[] = [];
  selected: any;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private navCtrl: NavController
  ) {
    this.selected = localStorage.getItem('language');
    this.getLangs();
  }

  ngOnInit() {

  }

  back() {
    this.navCtrl.back();
  }

  getLangs() {
    this.dummy = Array(10);
    this.api.get('lang').subscribe((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200) {
        const info = data.data.filter(x => x.status === '1');
        this.langs = info;
      }
    }, error => {
      this.dummy = [];
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }
  openMenu() {
    this.util.openMenu();
  }

  changed() {
    console.log(this.selected);
    const item = this.langs.filter(x => x.file === this.selected);
    if (item && item.length > 0) {
      this.util.direction = item[0].positions === '1' ? 'ltr' : 'rtl';
      document.documentElement.dir = this.util.direction;
      localStorage.setItem('language', this.selected);
      window.location.reload();
    }
  }
}
