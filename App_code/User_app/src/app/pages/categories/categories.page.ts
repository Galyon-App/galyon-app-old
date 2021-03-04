/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { CategoryService } from 'src/app/services/category.service';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

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
    public api: ApiService
  ) {
    this.getCates();
  }

  ngOnInit() {
  }

  openMenu() {
    this.util.openMenu();
  }

  getCates() {
    this.categories = [];
    this.dummy = Array(20);
    this.api.get('categories').subscribe((datas: any) => {
      this.dummy = [];
      if (datas && datas.data && datas.data.length) {
        datas.data.forEach(element => {
          if (element.status === '1') {
            const info = {
              id: element.id,
              name: element.name,
              cover: element.cover,
              subCates: []
            }
            this.categories.push(info);
          }
        });
      }
      this.api.get('subcate').subscribe((subCates: any) => {
        console.log('sub cates', subCates);
        if (subCates && subCates.status === 200 && subCates.data && subCates.data.length) {
          this.categories.forEach((element, i) => {
            subCates.data.forEach(sub => {
              if (sub.status === '1' && element.id === sub.cate_id) {
                this.categories[i].subCates.push(sub);
              }
            });
          });
          console.log('=>>', this.categories);
        }
      }, error => {
        console.log(error);
        this.util.errorToast(this.util.getString('Something went wrong'));
      });
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
      this.dummy = [];
    });
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
    this.router.navigate(['/tabs/categories/products'], navData);
  }

}
