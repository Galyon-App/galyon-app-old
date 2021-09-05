/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public cart: CartService,
    public util: UtilService
  ) { }


}
