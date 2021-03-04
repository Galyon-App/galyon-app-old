/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import * as moment from 'moment';
import { ComponentCanDeactivate } from 'src/app/leaved/leaved.guard';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements ComponentCanDeactivate {


  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;
  @ViewChildren('messages') messagesList: QueryList<any>;
  users: any[] = [];
  dummy: any[] = [];
  id: any;
  message: any;
  messages: any[] = [];
  selectedId: any;
  name: any;
  avtar: any;
  type: any;
  interval: any;
  uid: any;
  @HostListener('window:beforeunload')
  canDeactivate(): any {
    console.log('ok');
  };
  constructor(
    public api: ApisService,
    public util: UtilService
  ) {
    this.getChats();
    this.uid = localStorage.getItem('uid');
  }


  getChats() {
    const param = {
      id: localStorage.getItem('uid')
    };
    this.dummy = Array(10);
    this.api.post('chats/getByGroup', param).then((data: any) => {
      console.log(data);
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
        this.api.post('users/getChatsNames', uid).then((uids: any) => {
          this.dummy = [];
          if (uids && uids.status === 200) {
            this.users = uids.data;
            console.log('users ----->', this.users);
          }
        }, error => {
          console.log(error);
          this.users = [];
          this.dummy = [];
        });
      } else {
        this.dummy = [];
      }
    }, error => {
      console.log(error);
    });
  }

  ngOnInit() {
  }

  search(str) {
    this.resetChanges();
    console.log('string', str);
    this.users = this.filterItems(str);
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  protected resetChanges = () => {
    this.users = this.dummy;
  }

  setFilteredItems() {
    console.log('clear');
    this.users = [];
    this.users = this.dummy;
  }

  filterItems(searchTerm) {
    return this.users.filter((item) => {
      if (item.type === 'venue') {
        return item.fname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      } else {
        return item.fullname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      }
    });

  }

  admin() {
    this.id = '0';
    this.name = 'Support';
    this.getChatss();
    this.interval = setInterval(() => {
      console.log('calling in interval');
      this.getChatss();
    }, 12000);
  }
  chatUser(item) {
    console.log(item);
    this.id = item.id;
    this.name = item.name;
    this.getChatss();
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      console.log('calling in interval');
      this.getChatss();
    }, 12000);
  }

  getChatss() {
    // store _ opponent
    const param = {
      id: localStorage.getItem('uid') + '_' + this.id,
      oid: this.id
    };
    this.api.post('chats/getById', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        this.messages = data.data;
      }
    }, error => {
      console.log(error);
    });
  }

  send() {
    // store to opponent
    console.log(this.message);
    if (!this.message || this.message === '') {
      return false;
    }
    const msg = this.message;
    this.message = '';
    const param = {
      room_id: this.id,
      uid: localStorage.getItem('uid') + '_' + this.id,
      from_id: localStorage.getItem('uid'),
      message: msg,
      message_type: 'store',
      status: 1,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    this.api.post('chats/save', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        this.getChatss();
      }
    }, error => {
      console.log(error);
    });
  }
}
