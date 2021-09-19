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
import { StoresService } from 'src/app/services/stores.service';
import { UtilService } from 'src/app/services/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
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
    totol_stores: 0
  };

  constructor(
    public api: ApisService,
    private router: Router,
    public util: UtilService,
  ) {

  }

  openIt(item) {
    //this.router.navigate([item]);
  }
}
