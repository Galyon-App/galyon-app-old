/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { UtilService } from 'src/app/services/util.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { environment } from 'src/environments/environment';
import { StoresService } from 'src/app/services/stores.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { Role } from 'src/app/models/role.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @ViewChild('content', { static: false }) content: any;
  
  page: number = 1;
  orders: any[] = [];
  dummyOrders: any[] = [];
  dummy = Array(5);

  stage_term: any = 'all';
  search_term: any = '';

  newOrders: any[] = [];
  onGoingOrders: any[] = [];
  oldOrders: any[] = [];
  dummyDrivers: any[] = [];
  selectedDriver: any = '';

  public get isStore(): boolean {
    return this.authServ.userValue.role == Role.Merchant;
  }

  constructor(
    public api: ApisService,
    private router: Router,
    public util: UtilService,
    private storeServ: StoresService,
    private modalService: NgbModal,
    private authServ: AuthService
  ) {
    this.getOrdersRecently();
  }

  getOrdersRecently() {

    let param = {
      limit_start: 0,
      limit_length: 100,
      has_user_name: "1",
      has_store_name: "0",
      store_id: null,
    };
    if(this.isStore) {
      param.store_id = this.storeServ.storeValue.uuid;
      param.has_store_name = "1";
    }

    this.api.post('galyon/v1/orders/getOrdersRecently', param).then((response: any) => {

      this.dummy = [];
      if (response && response.success  && response.data) {
        // this.orders = data.data;
        const orders = response.data;
        orders.forEach(element => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.items)) {
            element.orders = JSON.parse(element.items);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
          }
        });
        this.orders = orders;
        this.dummyOrders = orders;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
    });
  }

  ngOnInit(): void {
  }

  getCurrency() {
    return environment.general.symbol;
  }

  getClass(item) {
    if (item === 'created' || item === 'accepted' || item === 'picked') {
      return 'btn btn-primary btn-round';
    } else if (item === 'delivered') {
      return 'btn btn-success btn-round';
    } else if (item === 'rejected' || item === 'cancel') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  getDates(date) {
    return moment(date).format('llll');
  }

  openOrder(item) {
    const navData: NavigationExtras = {
      queryParams: {
        uuid: item.uuid
      }
    };
    this.router.navigate(['merchant/manage-orders'], navData);
  }

  async open(status) {
    console.log(status);
    try {
      this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    } catch (error) {
      console.log(error);
    }
  }

  changeStatus(value) {
  }

  searchFilter() {
    this.resetChanges();
    this.orders = this.filterItems();
  }

  protected resetChanges = () => {
    this.orders = this.dummyOrders;
  }

  filterItems() {
    if(this.stage_term != "all") {
      return this.orders.filter((item) => {
        return item.stage.toLowerCase().indexOf(this.stage_term) > -1 && item.uuid.toLowerCase().indexOf(this.search_term.toLowerCase()) > -1;
      });
    } else {
      return this.orders.filter((item) => {
        return item.uuid.toLowerCase().indexOf(this.search_term.toLowerCase()) > -1;
      });
    }    
  }

  close() {
  }
}
