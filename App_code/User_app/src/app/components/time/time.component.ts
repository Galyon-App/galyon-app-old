/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import * as moment from 'moment';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
})
export class TimeComponent implements OnInit {

  today: any;
  nextDay: any;
  constructor(
    private popoverController: PopoverController,
    public util: UtilService
  ) {
    this.today = moment().format('dddd, MMMM Do YYYY');
    this.nextDay = moment().add(1, 'days').format('dddd, MMMM Do YYYY');
  }

  ngOnInit() { }

  selected(item) {
    this.popoverController.dismiss(item);
  }
}
