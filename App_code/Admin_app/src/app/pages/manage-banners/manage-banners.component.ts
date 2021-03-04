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
import { ApisService } from 'src/app/services/apis.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { Location } from '@angular/common';
@Component({
  selector: 'app-manage-banners',
  templateUrl: './manage-banners.component.html',
  styleUrls: ['./manage-banners.component.scss']
})
export class ManageBannersComponent implements OnInit {
  position: any;
  type: any;
  coverImage: any;
  link: any;

  search: any;

  cate: any[] = [];
  dummyCate: any[] = [];

  products: any[] = [];
  dummyProducts: any[] = [];

  banner_to_upload: any = '';

  edit: boolean;

  message: any;

  id: any;
  constructor(
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    private route: ActivatedRoute,
    private navCtrl: Location,
    private router: Router
  ) {
    const param = {
      id: localStorage.getItem('uid')
    }
    this.api.auth(param).then((data) => {
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
    this.route.queryParams.subscribe((data) => {
      if (data && data.id) {
        this.edit = true;
        this.id = data.id;
        this.getById();
      } else {
        this.edit = false;
        this.getDatas();

      }
    });

  }

  ngOnInit(): void {
  }

  getById() {
    const param = {
      id: this.id
    };

    this.spinner.show();
    this.api.post('banners/getById', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200 && data.data && data.data.length) {
        const info = data.data[0];
        this.coverImage = info.cover;
        this.position = info.position;
        this.type = info.type;
        this.message = info.message;
        this.link = info.link;
        this.getDatas();
      } else {
        this.error(this.api.translate('Something went wrong'));
      }
    }).catch((error) => {
      console.log(error);
      this.spinner.hide();
      this.error(this.api.translate('Something went wrong'));
    });
  }

  getDatas() {
    this.api.get('products').then((data: any) => {
      console.log('products', data);
      this.dummyProducts = [];
      if (data && data.status === 200 && data.data && data.data.length > 0) {
        this.dummyProducts = data.data;
        if (this.id && this.type === '1') {
          const name = this.dummyProducts.filter(x => x.id === this.link);
          console.log('nama,maa==>>>', name);
          if (name && name.length) {
            this.search = name[0].name;
          }
        }
      }
    }).catch(error => {
      console.log(error);
    });

    this.api.get('categories').then((datas: any) => {
      console.log(datas);
      this.dummyCate = [];
      if (datas && datas.data && datas.data.length) {
        this.dummyCate = datas.data;
        if (this.id && this.type === '0') {
          const name = this.dummyCate.filter(x => x.id === this.link);
          console.log('nama,maa==>>>', name);
          if (name && name.length) {
            this.search = name[0].name;
          }
        }
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


  searchCate(str) {
    console.log(str);
    // console.log(this.dummyCate);
    if (str && str !== '') {
      // this.cate = this.dummyCate.filter(x => x.name === str);
      this.cate = this.dummyCate.filter((item) => {
        return item.name.toLowerCase().indexOf(str.toLowerCase()) > -1;
      });
    } else {
      this.cate = [];
    }
  }

  selectCate(item) {
    this.link = item.id;
    this.search = item.name;
    this.cate = [];
  }

  selectProduct(item) {
    this.link = item.id;
    this.search = item.name;
    this.products = [];
  }

  changeType() {
    this.search = '';
    this.link = '';
  }

  searchProduct(str) {
    console.log(str);
    // console.log(this.dummyProducts);
    if (str && str !== '') {
      this.products = this.dummyProducts.filter((item) => {
        return item.name.toLowerCase().indexOf(str.toLowerCase()) > -1;
      });
    } else {
      this.products = [];
    }
  }

  preview_banner(files) {

    console.log('fle', files);
    this.banner_to_upload = [];
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    this.banner_to_upload = files;
    if (this.banner_to_upload) {
      console.log('ok');
      this.spinner.show();
      this.api.uploadFile(this.banner_to_upload).subscribe((data: any) => {
        console.log('==>>', data);
        this.spinner.hide();
        if (data && data.status === 200 && data.data) {
          this.coverImage = data.data;
        }
      }, err => {
        console.log(err);
        this.spinner.hide();
      });
    } else {
      console.log('no');
    }
  }

  create() {
    console.log('create');
    if (!this.position || this.position === '' || !this.type || this.type === '' || !this.link || this.link === '' ||
      !this.message || this.message === '') {
      this.error('All Fields are required');
      return false;
    }

    if (this.coverImage === '' || !this.coverImage) {
      this.error(this.api.translate('Please add image'));
      return false;
    }
    console.log('ok');
    const param = {
      cover: this.coverImage,
      position: this.position,
      link: this.link,
      type: this.type,
      status: 1,
      message: this.message
    };
    this.spinner.show();
    this.api.post('banners/save', param).then((data: any) => {
      this.spinner.hide();
      console.log(data);
      if (data && data.status && data.status === 200) {
        this.api.alerts(this.api.translate('Success'), this.api.translate('Banner Added'), 'success');
        this.navCtrl.back();
      } else {
        this.error(this.api.translate('Something went wrong'));
      }

    }, error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }

  update() {
    console.log('update');
    console.log('create');
    if (!this.position || this.position === '' || !this.type || this.type === '' || !this.link || this.link === '' ||
      !this.message || this.message === '') {
      this.error('All Fields are required');
      return false;
    }

    if (this.coverImage === '' || !this.coverImage) {
      this.error(this.api.translate('Please add image'));
      return false;
    }
    console.log('ok');
    const param = {
      cover: this.coverImage,
      position: this.position,
      link: this.link,
      type: this.type,
      status: 1,
      message: this.message,
      id: this.id
    };
    this.spinner.show();
    this.api.post('banners/editList', param).then((data: any) => {
      this.spinner.hide();
      console.log(data);
      if (data && data.status && data.status === 200) {
        this.api.alerts(this.api.translate('Success'), this.api.translate('Updated!'), 'success');
        this.navCtrl.back();
      } else {
        this.error(this.api.translate('Something went wrong'));
      }

    }, error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      this.spinner.hide();
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });
  }
}
