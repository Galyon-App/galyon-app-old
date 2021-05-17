/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
      img: 'assets/imgs/category/normal.png',
      name: 'Veg',
      color: 'rgba(237, 129, 21, 0.2)'
    },
    {
      img: 'assets/imgs/category/verified.png',
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
