import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class RewardsPage implements OnInit {

  cards = [1];
  tabID = 1;

  activity = [
      {
        name : 'Used Points',
        date : '14 Nov 2022',
        amount : '5.00',
        credit: false
      },
      {
          name : 'Raffle Winnings',
          date : '14 Nov 2022',
          amount : '35.88',
          credit: true
      },
      {
          name : 'Shopping Points',
          date : '13 Nov 2022',
          amount : '14.79',
          credit: true
      },
      {
        name : 'Refer a Friend',
        date : '12 Nov 2022',
        amount : '42.11',
        credit: true
    },
    {
      name : 'Refer a Friend',
      date : '11 Nov 2022',
      amount : '78.88',
      credit: true
   },
  ];

  constructor(
    private util: UtilService,
    private navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  btnAddNewCard() {
    const param: NavigationExtras = {
      queryParams: {
        source: "reward-page"
      }
    };
    this.router.navigate(['/user/rewards/cards'], param);
  }

  btnShopNow() {
    const param: NavigationExtras = {
      queryParams: {
        source: "reward-page"
      }
    };
    this.router.navigate(['/user/shops'], param);
  }

  btnJoinRaffle() {
    this.util.showToast("Not yet implemented", "primary", "bottom");
    // const param: NavigationExtras = {
    //   queryParams: {
    //     source: "reward-page"
    //   }
    // };
    // this.router.navigate(['/user/rewards/raffle'], param);
  }

  btnPlayGames() {
    this.util.showToast("Not yet implemented", "primary", "bottom");
    // const param: NavigationExtras = {
    //   queryParams: {
    //     source: "reward-page"
    //   }
    // };
    // this.router.navigate(['/user/rewards/games'], param);
  }

  btnReferAFriend() {
    const param: NavigationExtras = {
      queryParams: {
        source: "reward-page"
      }
    };
    this.router.navigate(['/user/rewards/referral'], param);
  }

}
