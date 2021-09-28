import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  isReady: boolean = false;

  constructor(
    public util: UtilService,
    private appServ: AppService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.isReady = true;
    this.appServ.setAppReady();
  }
}
