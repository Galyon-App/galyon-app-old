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
import { UtilService } from 'src/app/services/util.service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
declare var google: any;
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  name: any = '';
  address: any = '';
  descritions: any = '';
  time: any = '';
  openTime: any = '';
  closeTime: any = '';
  latitude: any = '';
  longitude: any = '';
  id: any = '';
  coverImage: any = '';
  mobile: any;
  edit_flag: boolean;
  constructor(
    public util: UtilService,
    private navCtrl: NavController,
    public api: ApiService,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
  ) {
    this.edit_flag = true;
    this.id = localStorage.getItem('suid');
    this.getVenue();
  }

  ngOnInit() {
  }

  getVenue() {
    const param = {
      id: this.id
    };
    this.util.show();
    this.api.post('stores/getById', param).subscribe((datas: any) => {
      console.log(datas);
      this.util.hide();
      if (datas && datas.status === 200 && datas.data.length) {
        const info = datas.data[0];
        console.log('-------->', info);
        this.name = info.name;
        this.address = info.address;
        this.latitude = info.lat;
        this.longitude = info.lng;
        this.coverImage = info.cover;
        this.descritions = info.descriptions;
        this.openTime = info.open_time;
        this.closeTime = info.close_time;
        this.mobile = info.mobile;
      } else {
        this.util.errorToast(this.util.getString('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }


  update() {
    console.log(this.name, this.address, this.descritions, this.time,
      this.openTime, this.closeTime);
    if (this.name === '' || this.address === '' || this.descritions === '' || this.openTime === '' || this.closeTime === ''
      || !this.openTime || !this.closeTime) {
      this.util.errorToast(this.util.getString('All Fields are required'));
      return false;
    }

    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ address: this.address }, (results, status) => {
      console.log(results, status);
      if (status === 'OK' && results && results.length) {
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
        console.log('----->', this.latitude, this.longitude);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
        return false;
      }
    });

    if (!this.coverImage || this.coverImage === '') {
      this.util.errorToast(this.util.getString('Please add your cover image'));
      return false;
    }
    const param = {
      name: this.name,
      address: this.address,
      descriptions: this.descritions,
      lat: this.latitude,
      lng: this.longitude,
      cover: this.coverImage,
      open_time: this.openTime,
      close_time: this.closeTime,
      id: this.id,
    };

    this.util.show();
    this.api.post('stores/editList', param).subscribe((datas: any) => {
      console.log(datas);
      this.util.hide();
      if (datas && datas.status === 200) {
        this.navCtrl.back();
      } else {
        this.util.errorToast(this.util.getString('Something went wrong'));
      }

    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  async updateProfile() {
    const actionSheet = await this.actionSheetController.create({
      header: this.util.getString('Choose from'),
      buttons: [{
        text: this.util.getString('Camera'),
        icon: 'camera',
        handler: () => {
          console.log('camera clicked');
          this.upload('camera');
        }
      }, {
        text: this.util.getString('Gallery'),
        icon: 'images',
        handler: () => {
          console.log('gallery clicked');
          this.upload('gallery');
        }
      }, {
        text: this.util.getString('Cancel'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    await actionSheet.present();
  }

  upload(type) {
    try {
      const options: CameraOptions = {
        quality: 100,
        targetHeight: 800,
        targetWidth: 800,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType: type === 'camera' ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY
      };
      this.camera.getPicture(options).then((url) => {
        console.log('url->', url);
        this.util.show(this.util.getString('uploading'));
        const alpha = {
          img: url,
          type: 'jpg'
        };
        console.log('parma==>', alpha);
        this.api.nativePost('users/upload_file', alpha).then((data) => {
          this.util.hide();
          console.log('data', JSON.parse(data.data));
          const info = JSON.parse(data.data);
          this.coverImage = info.data;
          console.log('cover image', this.coverImage);
          const param = {
            cover: this.coverImage,
            id: localStorage.getItem('uid')
          };
          this.util.show(this.util.getString('updating...'));
          this.api.post('users/edit_profile', param).subscribe((update: any) => {
            this.util.hide();
            console.log(update);
          }, error => {
            this.util.hide();
            console.log(error);
          });
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.getString('Something went wrong'));
        }).catch(error => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.getString('Something went wrong'));
        });
      });

    } catch (error) {
      console.log('error', error);
    }
  }

  back() {
    this.navCtrl.back();
  }
}
