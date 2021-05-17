/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { UtilService } from './../../services/util.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  model;
  constructor(private route: Router, public util: UtilService) { }

  ngOnInit(): void {
  }

  goToOrder() {
    this.route.navigate(['/order']);
  }

}
