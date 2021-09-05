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
    this.router.navigate(['products'], navData);
  }

  back() {
    this.navCtrl.back();
  }

}
