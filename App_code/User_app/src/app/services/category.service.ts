/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  category = [
    {
      img: 'assets/imgs/category/fruit.png',
      name: 'Fruits',
      color: 'rgba(226, 61, 61, 0.2)'
    },
    {
      img: 'assets/imgs/category/beverages.png',
      name: 'Beverages',
      color: 'rgba(113, 239, 239,0.2)'
    },
    {
      img: 'assets/imgs/category/veg.png',
      name: 'Veg',
      color: 'rgba(237, 129, 21, 0.2)'
    },
    {
      img: 'assets/imgs/category/non-veg.png',
      name: 'Non-veg',
      color: 'rgba(243, 210, 146,0.3)'
    },
    {
      img: 'assets/imgs/category/bread.png',
      name: 'Backery',
      color: 'rgba(195, 132, 91,0.3)'
    },
    {
      img: 'assets/imgs/category/grain.png',
      name: 'Grains',
      color: 'rgba(246, 225, 127,0.3)'
    },
    {
      img: 'assets/imgs/category/meat.png',
      name: 'Meat',
      color: 'rgba(250, 118, 141,0.3)'
    },
    {
      img: 'assets/imgs/category/dairy.png',
      name: 'Dairy',
      color: 'rgb(216, 242, 246)'
    },
    {
      img: 'assets/imgs/category/clean2.png',
      name: 'Cleaners',
      color: 'rgba(250, 118, 141,0.3)'
    }
  ];

  constructor() { }
}
