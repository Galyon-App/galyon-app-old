/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  category: any[] = [];
  dummyCate: any[] = [];
  dummy = Array(20);
  id: any;
  constructor(
    private modalCtrl: ModalController,
    public api: ApiService,
    public util: UtilService,
    private navParam: NavParams
  ) {
    this.getCategory();
    this.id = this.navParam.get('uuid');
  }

  ngOnInit() {
  }

  getCategory() {
    this.api.get('categories').subscribe((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        this.category = data.data;
        this.dummyCate = data.data;
      } else {
        this.util.errorToast(this.util.getString('No category found'));
      }
    }, error => {
      this.util.errorToast(this.util.getString('Something went wrong'));
      this.dummy = [];
      console.log(error);
    });
  }


  close() {
    this.modalCtrl.dismiss();
  }

  selected() {
    const name = this.category.filter(x => x.uuid === this.id);
    console.log('name', name);
    this.modalCtrl.dismiss({ id: this.id, name: name[0].name }, 'selected');
  }

  onSearchChange(event) {
    console.log(event.detail.value);
    this.category = this.dummyCate.filter((ele: any) => {
      return ele.name.toLowerCase().includes(event.detail.value.toLowerCase());
    });
  }
}
