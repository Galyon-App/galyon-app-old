/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  content: any;
  loaded: boolean;
  constructor(
    private api: ApiService,
    public util: UtilService
  ) {
    const param = {
      id: 6
    };
    this.loaded = false;
    this.api.post('pages/getById', param).then((data: any) => {
      console.log(data);
      this.loaded = true;
      if (data && data.status === 200 && data.data.length > 0) {
        const info = data.data[0];
        this.content = info.content;
      }
    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  ngOnInit(): void {
  }


  getContent() {
    return this.content;
  }

}
