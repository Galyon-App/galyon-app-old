/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { CategoryService } from 'src/app/services/category.service';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  categories: any[] = [];
  dummy = Array(20);
  selectedIndex: any;
  subIndex: any;

  constructor(
    public util: UtilService,
    private cat: CategoryService,
    private router: Router,
    public api: ApiService,
    private navCtrl: NavController,
  ) {
    this.getCates();
  }

  ngOnInit() {
  }  

  getCates() {
    this.dummy = Array(10);
    this.categories = [];

    this.api.get('galyon/v1/category/getAllCategorys').subscribe((response: any) => {
      if (response && response.success && response.data) {
        let allCategories = response.data;
        this.categories = allCategories.filter((x) => x.parent_id == null);
        this.categories.forEach((parent, i) => {
          this.categories[i].subCates = [];
          let subcats = allCategories.filter((x) => x.parent_id == parent.uuid);
          subcats.forEach(child => {
            this.categories[i].subCates.push(child);
          });
        });
        this.dummy = [];
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  openMenu() {
    this.util.openMenu();
  }

  change(id) {
    if (this.selectedIndex === id) {
      this.selectedIndex = '';
    } else {
      this.selectedIndex = id;
    }
  }

  goToProductList(val) {
    this.subIndex = val.id;
    const navData: NavigationExtras = {
      queryParams: {
        id: val.id,
        name: val.name,
        from: 'categories'
      }
    }
    this.router.navigate(['products'], navData);
  }

  back() {
    this.navCtrl.back();
  }

}
