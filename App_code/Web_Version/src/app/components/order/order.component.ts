/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { UtilService } from './../../services/util.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  typeFilter = [
    'Ordered',
    'Under Process',
    'Shipped',
    'Returned',
    'Cancelled',
    'Delivered'
  ];

  timeFilter = [
    'Last 30 Days',
    'Last 6 Months',
    'Last One Year'
  ];
  type;
  time;

  products = [
    {
      img: 'assets/imgs/products/1.jpeg',
      name: 'Cheetos Twisted',
      price: '20',
    },
    {
      img: 'assets/imgs/products/2.jpeg',
      name: 'Mini Torrefaction Fonce',
      price: '120',
    },
    {
      img: 'assets/imgs/products/3.jpeg',
      name: 'Torrefaction Fonce',
      price: '240',
    },
  ];

  constructor(private router: Router, public util: UtilService) { }

  ngOnInit(): void {
  }

  chooseType(val) {
    this.type = val;
  }

  chooseTime(val) {
    this.time = val;
  }

  goToOrderDetail() {
    this.router.navigate(['/order-detail']);
  }

}
