/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  dummy: any[] = [];
  users: any[] = [];
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.getChats(null);
  }

  getChats(event) {
    const param = {
      id: localStorage.getItem('uid')
    };
    this.dummy = Array(10);
    this.api.post('chats/getByGroup', param).subscribe((data: any) => {
      if (data && data.status === 200) {
        const info = [];
        data.data.forEach(element => {
          info.push(element.from_id);
          info.push(element.room_id);
        });
        let uniq = [...new Set(info)];
        uniq = uniq.filter(x => x !== localStorage.getItem('uid'));
        console.log('uniq->>', uniq);
        const uid = {
          id: uniq.join()
        };
        this.api.post('stores/getChatsNames', uid).subscribe((uids: any) => {
          this.dummy = [];
          console.log(uids);
          if (uids && uids.status === 200) {
            this.users = uids.data;
          }
        }, error => {
          console.log(error);
          this.users = [];
          this.dummy = [];
          this.util.errorToast(this.util.getString('Something went wrong'));
        });
      } else {
        this.dummy = [];
      }
      if(event != null) {
        event.target.complete();
      }
    }, error => {
      if(event != null) {
        event.target.complete();
      }
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  ngOnInit() {
  }

  back() {
    this.navCtrl.back();
  }

  onAdmin() {
    const param: NavigationExtras = {
      queryParams: {
        id: 0,
        name: 'Support',
        uid: localStorage.getItem('uid')
      }
    };
    this.router.navigate(['inbox'], param);
  }

  onChat(item) {
    console.log(localStorage.getItem('uid'));
    const param: NavigationExtras = {
      queryParams: {
        id: item.id,
        name: item.name,
        uid: localStorage.getItem('uid')
      }
    };
    this.router.navigate(['inbox'], param);
  }
}
