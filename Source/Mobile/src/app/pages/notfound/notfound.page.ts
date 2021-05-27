import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.page.html',
  styleUrls: ['./notfound.page.scss'],
})
export class NotfoundPage implements OnInit {

  constructor(
    public util: UtilService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  returnToHome() {
    //this.navCtrl.navigateRoot('user/home');
    this.navCtrl.back();
  }

}
