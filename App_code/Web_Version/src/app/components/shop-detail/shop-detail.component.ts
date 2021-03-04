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
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss']
})
export class ShopDetailComponent implements OnInit {

  tabID = 1;

  reviews = [
    {
      no: '5',
      per: 70
    },
    {
      no: '4',
      per: 62
    },
    {
      no: '3',
      per: 57
    },
    {
      no: '2',
      per: 42
    },
    {
      no: '1',
      per: 37
    },
  ];

  products = [
    {
      img: 'assets/imgs/products/1.jpeg',
      name: 'Cheetos Twisted',
      price: '20',
      price2: '18'
    },
    {
      img: 'assets/imgs/products/2.jpeg',
      name: 'Mini Torrefaction Fonce',
      price: '120',
      price2: '110'
    },
    {
      img: 'assets/imgs/products/3.jpeg',
      name: 'Torrefaction Fonce',
      price: '240',
      price2: '220'
    },
    {
      img: 'assets/imgs/products/4.jpeg',
      name: 'Tim hotton Decaf',
      price: '240',
      price2: '230'
    },
    {
      img: 'assets/imgs/products/5.jpeg',
      name: 'Premiun Poundo Iyan',
      price: '200',
      price2: '190'
    },
    {
      img: 'assets/imgs/products/6.jpeg',
      name: 'Nutella',
      price: '130',
      price2: '120'
    },
    {
      img: 'assets/imgs/products/7.jpeg',
      name: '2 Pack of Nutella',
      price: '275',
      price2: '260'
    },
    {
      img: 'assets/imgs/products/8.jpeg',
      name: 'Organic Oatmeal',
      price: '245',
      price2: '230'
    },
  ];

  constructor(private router: Router, public util: UtilService) { }

  ngOnInit(): void {
  }

  goToTracker() {
    this.router.navigate(['/tracker']);
  }

  changeTab(val) {
    this.tabID = val;
  }

  getBackground(start, end) {
    const style = 'linear-gradient(to right, black 0%, black ' + end + '%, #CCC ' + end + '% , #CCC 100%)';
    return (style);
  }

}
