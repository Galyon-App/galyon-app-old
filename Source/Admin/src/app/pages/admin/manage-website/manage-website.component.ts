import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-website',
  templateUrl: './manage-website.component.html',
  styleUrls: ['./manage-website.component.css']
})
export class ManageWebsiteComponent {

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor(
    public api: ApisService,
    public util: UtilService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.getFeaturedCategory();
    this.getAllCategories();
  }

  getAllCategories() {
    this.dropdownList = [];
    this.api.get('galyon/v1/category/getAllCategorys').then((response: any) => {
      if (response && response.success && response.data) {
        this.dropdownList = response.data.filter(x => x.status === '1' && x.deleted_at === null)
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'uuid',
          textField: 'name',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          allowSearchFilter: true
        };
      }
    }, error => {
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  getFeaturedCategory() {
    this.spinner.show();
    this.api.get('galyon/v1/settings/getFeaturedCategories').then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.selectedItems = response.data;          
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'uuid',
          textField: 'name',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          allowSearchFilter: true
        };
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  submit() {
    if (!this.selectedItems.length || this.selectedItems.length === 0) {
      this.util.error('Select Category');
      return false;
    }

    if (this.selectedItems.length > 5) {
      this.util.error('Please select upto 5 category');
      return false;
    }

    this.spinner.show();
    this.api.post('galyon/v1/settings/setFeaturedCategories', {
      featured_categories: JSON.stringify(this.selectedItems)
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.util.success('Featured categories is now updated');
      } else {
        this.util.error(response.message);
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.util.error(this.api.translate('Something went wrong'));
    });
  }
}
