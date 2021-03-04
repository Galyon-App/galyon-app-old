import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.page.html',
  styleUrls: ['./sort.page.scss'],
})
export class SortPage implements OnInit {
  discountValue: any;

  min: any;
  max: any;

  priceFilter = {
    lower: 10,
    upper: 500
  };
  fromFilter: any;
  constructor(
    private modalCtrl: ModalController,
    private navParam: NavParams
  ) {
    this.min = this.navParam.get('min') ? this.navParam.get('min') : 0;
    this.max = this.navParam.get('max') ? this.navParam.get('max') : 100;
    this.fromFilter = this.navParam.get('from');
    this.discountValue = this.navParam.get('discountSelected');
  }

  ngOnInit() {
  }
  close() {
    console.log('clear');
    this.discountValue = null;
    this.modalCtrl.dismiss({
      min: this.priceFilter.lower, max: this.priceFilter.upper,
      discount: this.discountValue, from: this.fromFilter,
      close: true
    });
  }

  apply() {
    console.log(this.discountValue);
    console.log(this.priceFilter);
    this.modalCtrl.dismiss({
      min: this.priceFilter.lower, max: this.priceFilter.upper,
      discount: this.discountValue, from: this.fromFilter,
      close: false
    });
  }

  discount(value) {
    console.log(value);
    this.discountValue = value;
  }
}
