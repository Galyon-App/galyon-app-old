import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.page.html',
  styleUrls: ['./referral.page.scss'],
})
export class ReferralPage implements OnInit {

  public referralCode: any = 'xxxxxxx';

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private util: UtilService
  ) { }

  ngOnInit() {

  }

  goBack() {
    this.navCtrl.back();
  }

  copyCodeToCB() {
    this.util.showToast("Not yet implemented", "primary", "bottom");
  }

}
