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
import { Router } from '@angular/router';
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

  @HostListener('window:beforeunload')
  canDeactivate(): any {
    console.log('ok');
  };
  constructor(
    public api: ApisService,
    private util: UtilService,
    private router: Router
  ) {
    const param2 = {
      id: localStorage.getItem('uid')
    }
    this.api.auth(param2).then((data) => {
      if (data !== true) {
        localStorage.removeItem('uid');
        this.router.navigate(['login']);
      }
    }, error => {
      console.log(error);
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    }).catch((error) => {
      console.log(error);
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    });
    const param = {
      id: 0
    };
    this.dummy = Array(10);
    this.users = [];
    this.api.post('chats/getByGroup', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        const info = [];
        const info2 = [];
        const info3 = [];
        data.data.forEach(element => {
          if (element.message_type === 'users') {
            info2.push(element.from_id);
            info2.push(element.room_id);
          } else if (element.message_type === 'store') {
            info.push(element.from_id);
            info.push(element.room_id);
          } else if (element.message_type === 'drivers') {
            info3.push(element.from_id);
            info3.push(element.room_id);
          }
        });
        const uniq = [...new Set(info)];
        console.log('uniq->>', uniq);
        const uid = {
          id: uniq.join()
        };
        this.api.post('stores/getChatsNames', uid).then((uids: any) => {
          this.dummy = [];
          console.log(uids);
          if (uids && uids.status === 200) {
            // this.users = uids.data;
            uids.data.forEach(element => {
              console.log(element);
              const dats = {
                id: element.uid,
                name: element.name,
                cover: element.cover,
                type: 'store'
              };
              this.users.push(dats);
            });
          }
        }, error => {
          console.log(error);
          this.users = [];
          this.dummy = [];
        });

        const uniq2 = [...new Set(info2)];
        console.log('uniq->>', uniq2);
        const uid2 = {
          id: uniq2.join()
        };
        this.api.post('users/getChatsNames', uid2).then((uids: any) => {
          this.dummy = [];
          console.log(uids);
          if (uids && uids.status === 200) {
            // this.users = uids.data;
            uids.data.forEach(element => {
              console.log(element);
              const dats = {
                id: element.id,
                name: element.first_name + ' ' + element.last_name,
                cover: element.cover,
                type: 'users'
              };
              this.users.push(dats);
            });

            console.log('all users-->>', this.users);
          }
        }, error => {
          console.log(error);
          this.users = [];
          this.dummy = [];
        });

        const uniq3 = [...new Set(info3)];
        console.log('uniq->>', uniq2);
        const uid3 = {
          id: uniq3.join()
        };
        this.api.post('drivers/getChatsNames', uid3).then((uids: any) => {
          this.dummy = [];
          console.log(uids);
          if (uids && uids.status === 200) {
            // this.users = uids.data;
            uids.data.forEach(element => {
              console.log(element);
              const dats = {
                id: element.id,
                name: element.first_name + ' ' + element.last_name,
                cover: element.cover,
                type: 'drivers'
              };
              this.users.push(dats);
            });

            console.log('all users-->>', this.users);
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
    }).catch((error) => {
      console.log(error);
    });
    this.interval = setInterval(() => {
      console.log('calling in interval');
      this.getMessages();
      this.getMessages2();
    }, 12000);

    this.util.successEject().subscribe((data: any) => {
      console.log('yes eject it');
      clearInterval(this.interval);
    });
  }

  getMessages() {
    const param = {
      id: 0 + '_' + this.id,
      oid: this.id
    };
    this.api.post('chats/getById', param).then((data: any) => {
      console.log(data);

      if (data && data.status === 200) {
        this.messages = data.data;
        this.scrollToBottom();
      }
    }, error => {
      console.log(error);
    }).catch((error) => {
      console.log(error);
    });
  }

  getMessages2() {
    const param = {
      id: this.id + '_' + 0,
      oid: this.id
    };
    this.api.post('chats/getById', param).then((data: any) => {
      console.log(data);

      if (data && data.status === 200) {
        this.messages = data.data;
        this.scrollToBottom();
      }
    }, error => {
      console.log(error);
    }).catch((error) => {
      console.log(error);
    });
  }

  getMessages3() {
    console.log('message from drivers');
    const param = {
      id: this.id + '_' + 0,
      oid: this.id
    };
    this.api.post('chats/getById', param).then((data: any) => {
      console.log(data);

      if (data && data.status === 200) {
        this.messages = data.data;
        this.scrollToBottom();
      }
    }, error => {
      console.log(error);
    }).catch((error) => {
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
  send() {
    console.log('this.mess', this.message);

    if (this.message && this.id) {
      const text = this.message;
      this.message = '';
      let fromMessage = '';
      if (this.type === 'users') {
        fromMessage = 0 + '_' + this.id;
      } else if (this.type === 'store') {
        fromMessage = this.id + '_' + 0;
      } else if (this.type === 'drivers') {
        fromMessage = 0 + '_' + this.id;
      }
      console.log('send');
      const param = {
        room_id: this.id,
        uid: fromMessage,
        from_id: 0,
        message: text,
        message_type: 'admin',
        status: 1,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      this.scrollToBottom();
      this.api.post('chats/save', param).then((data: any) => {
        console.log(data);
        if (data && data.status === 200) {
          if (this.type === 'users') {
            this.getMessages();
          } else {
            this.getMessages2();
          }
        } else {
        }
      }, error => {
        console.log(error);
      }).catch((error) => {
        console.log(error);
      });
    }
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
  chatUser(item) {
    console.log(item);
    this.type = item.type;
    this.name = item.name;
    this.avtar = item.cover;
    this.selectedId = item.id;
    this.id = item.id;
    this.messages = [];
    if (this.type === 'users') {
      this.getMessages();
    } else if (this.type === 'store') {
      this.getMessages2();
    } else if (this.type === 'drivers') {
      this.getMessages3();
    }
  }



}
