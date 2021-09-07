/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonContent } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  @ViewChild(IonContent, { read: IonContent, static: false }) myContent: IonContent;

  id: any;
  name: any;
  msg: any = '';
  messages: any[] = [];
  uid: any;
  loaded: boolean;
  yourMessage: boolean;
  interval: any;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public api: ApiService,
    public util: UtilService
  ) {
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.id && data.name) {
        this.uid = data.uid;
        this.id = data.id;
        this.loaded = false;
        this.name = data.name;
        this.getChats(null);
        this.interval = setInterval(() => {
          this.getChats(null);
        }, 12000);
      }
    });
  }

  ionViewDidLeave() {
    console.log('leaae');
    clearInterval(this.interval);
  }
  

  ngOnInit() {
  }

  getChats(event) {
    const param = {
      id: this.id + '_' + this.uid,
      oid: this.id
    };
    this.api.post('chats/getById', param).subscribe((data: any) => {
      this.loaded = true;
      this.yourMessage = true;
      if (data && data.status === 200) {
        this.messages = data.data;
        this.myContent.scrollToBottom(300);
      }
      if(event != null) {
        event.target.complete();
      }
    }, error => {
      this.loaded = true;
      this.yourMessage = true;
      this.util.errorToast(this.util.getString('Something went wrong'));
      if(event != null) {
        event.target.complete();
      }
    });
  }

  back() {
    this.navCtrl.back();
  }

  sendMessage() {
    // store to opponent
    console.log(this.msg);
    if (!this.msg || this.msg === '') {
      return false;
    }
    const msg = this.msg;
    this.msg = '';
    const param = {
      room_id: this.id,
      uid: this.id + '_' + this.uid,
      from_id: this.uid,
      message: msg,
      message_type: 'drivers',
      status: 1,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    this.myContent.scrollToBottom(300);
    this.yourMessage = false;
    this.api.post('chats/save', param).subscribe((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        this.getChats(null);
      } else {
        this.yourMessage = true;
      }
    }, error => {
      console.log(error);
      this.yourMessage = true;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

}
