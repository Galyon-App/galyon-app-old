/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NavigationExtras, Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/app/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastyService, ToastData, ToastOptions } from 'ng2-toasty';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { StoresService } from 'src/app/services/stores.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  dash_head = {
    totol_completed_orders: 0,
    totol__customers: 0,
    totol_active_products: 0,
    totol_reviews: 0
  };

  constructor(
    public api: ApisService,
    private router: Router,
    private modalService: NgbModal,
    public util: UtilService,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    private authService: AuthService,
    private storeService: StoresService
  ) {
    let owner_id = this.authService.userValue.uuid;
    this.storeService.getStoreByOwner(owner_id, (response) => {
      if(response) {
        //this.statusText = ' by ' + this.storeService.storeValue.name;
        //this.getData();
      }
    });
  }

  openIt(item) {
    this.router.navigate([item]);
  }
}
