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
export class ManageWebsiteComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  haveSave: boolean;
  id: any;
  constructor(
    public api: ApisService,
    public util: UtilService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    const param = {
      id: localStorage.getItem('uid')
    }
    this.api.auth(param).then((data) => {
      console.log('auth data->>', data);
      if (data !== true) {
        localStorage.removeItem('uid');
        this.router.navigate(['login']);
      }
    }, error => {
      console.log(error);
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    }).catch((error) => {
      console.log(error);
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    });
    this.getCurrennt();
    this.getCategory();
  }

  getCurrennt() {
    this.spinner.show();
    this.api.get('settings').then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        if (data && data.data && data.data.length) {
          const info = data.data[0];
          this.id = info.id;
          this.haveSave = true;
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.web_category)) {
            this.selectedItems = JSON.parse(info.web_category);
            console.log(this.selectedItems);
            this.dropdownSettings = {
              singleSelection: false,
              idField: 'id',
              textField: 'name',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              allowSearchFilter: true
            };
          }
        } else {
          this.haveSave = false;
        }
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.api.translate('Something went wrong'));
    });
  }

  getCategory() {
    this.dropdownList = [];
    this.api.get('categories').then((datas: any) => {
      console.log('cates', datas);
      if (datas && datas.data && datas.data.length) {
        this.dropdownList = datas.data.filter(x => x.status === '1');
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'id',
          textField: 'name',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          allowSearchFilter: true
        };
      }
    }, error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }

  error(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Error'),
      msg: this.api.translate(message),
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }

  success(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Success'),
      msg: this.api.translate(message),
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }

  ngOnInit(): void {
  }
  submit() {
    console.log(this.selectedItems);


    if (!this.selectedItems.length || this.selectedItems.length === 0) {
      this.error('Select Category');
      return false;
    }

    if (this.selectedItems.length > 5) {
      this.error('Please select upto 5 category');
      return false;
    }
    if (this.haveSave) {
      console.log('update');
      const param = {
        id: this.id,
        web_category: JSON.stringify(this.selectedItems)
      };

      console.log('param', param);
      this.spinner.show();
      this.api.post('settings/editList', param).then((data: any) => {
        console.log('data', data);
        this.spinner.hide();
        if (data && data.status === 200) {
          this.success('status updated');
          this.haveSave = true;
        } else {
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.api.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.api.translate('Something went wrong'));
      });


    } else {
      console.log('create');

      const param = {
        web_category: JSON.stringify(this.selectedItems)
      };

      console.log('param', param);
      this.spinner.show();
      this.api.post('settings/save', param).then((data: any) => {
        console.log('data', data);
        this.spinner.hide();
        if (data && data.status === 200) {
          this.success('status updated');
          this.haveSave = true;
          this.id = data.data.id;
        } else {
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.api.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.api.translate('Something went wrong'));
      });

    }
  }
}
