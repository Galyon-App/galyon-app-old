/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  loaded: boolean = false;
  title: any = '';
  content: any = '';
  last_update: string;

  constructor(
    public util: UtilService,
    private api: ApiService,
    private navCtrl: NavController,
    private appServ: AppService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe( params => {
      if(params.key && params.key != '') {
        this.getPage(params.key);
      } else {
        this.getPage('about');
      }
    });
  }

  getPage(key: string='') {
    this.loaded = false;
    this.api.post('galyon/v1/pages/getPageByID', {
      ukey: key
    }).subscribe((response: any) => {
      this.loaded = true;
      if (response && response.success && response.data) {
        const info = response.data;
        this.title = info.name;
        this.content = info.content;
        this.last_update = 'Last Updated: '+this.util.getDate(info.updated_at);
      } else {
        this.util.errorToast(this.util.getString(response.message));
      }
    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.appServ.setAppReady();
  }

  getContent() {
    return this.content;
  }

  back() {
    this.navCtrl.back();
  }

  openMenu() {
    this.util.openMenu();
  }
}
