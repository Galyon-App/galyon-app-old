/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products = [
    {
      img: 'assets/imgs/1.jpeg',
      name: 'Cheetos Twisted',
      price: '20',
      status: '1'
    },
    {
      img: 'assets/imgs/2.jpeg',
      name: 'Mini Torrefaction Fonce',
      price: '120',
      status: '1'
    },
    {
      img: 'assets/imgs/3.jpeg',
      name: 'Torrefaction Fonce',
      price: '240',
      status: '0'
    },
    {
      img: 'assets/imgs/4.jpeg',
      name: 'Tim hotton Decaf',
      price: '240',
      status: '0'
    },
    {
      img: 'assets/imgs/5.jpeg',
      name: 'Premiun Poundo Iyan',
      price: '200',
      status: '1'
    },
    {
      img: 'assets/imgs/6.jpeg',
      name: 'Nutella',
      price: '130',
      status: '1'
    },
    {
      img: 'assets/imgs/7.jpeg',
      name: '2 Pack of Nutella',
      price: '275',
      status: '1'
    },
    {
      img: 'assets/imgs/8.jpeg',
      name: 'Organic Oatmeal',
      price: '245',
      status: '1'
    },
    {
      img: 'assets/imgs/9.jpeg',
      name: 'Organic Chia Seeds',
      price: '450',
      status: '1'
    },
    {
      img: 'assets/imgs/10.jpeg',
      name: 'Walkers cheese & onion',
      price: '50',
      status: '1'
    },
  ];
  constructor() { }
}
