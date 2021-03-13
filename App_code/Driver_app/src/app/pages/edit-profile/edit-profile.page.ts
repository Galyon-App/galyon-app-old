/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})

export class EditProfilePage implements OnInit {
  fname: any;
  lname: any;
  mobile: any;
  gender: any;
  email: any;
  avatar: any;
  coverImage: any = '';
  edit_flag: boolean;
  current: boolean;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private navCtrl: NavController
  ) {
    this.edit_flag = true;
    console.log(localStorage.getItem('uid'));
    this.getProfile();
  }

  ngOnInit() {
  }

  getProfile() {
    const param = {
      id: localStorage.getItem('uid')
    };
    this.util.show();
    this.api.post('drivers/getById', param).subscribe((data: any) => {
      this.util.hide();
      console.log('user info=>', data);
      if (data && data.status === 200 && data.data && data.data.length) {
        const info = data.data[0];
        this.util.userInfo = info;
        this.fname = info.first_name;
        this.lname = info.last_name;
        this.mobile = info.mobile;
        this.gender = info.gender;
        this.coverImage = info.cover;
        this.email = info.email;
        this.current = info.current === 'active' ? true : false;
      }
    }, error => {
      console.log(error);
      this.util.hide();
    });
  }

  async updateProfile() {
    if(this.edit_flag == false) {
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

  update() {
    if (!this.fname || this.fname === '' || !this.lname || this.lname === '' || !this.mobile || this.mobile === '') {
      this.util.errorToast(this.util.getString('All Fields are required'));
      return false;
    }
    const param = {
      first_name: this.fname,
      last_name: this.lname,
      email: this.email,
      gender: this.gender,
      cover: this.coverImage,
      mobile: this.mobile,
      id: localStorage.getItem('uid'),
      current: this.current === true ? 'active' : 'busy',
    };
    this.util.show(this.util.getString('Updating...'));
    this.api.post('drivers/edit_profile', param).subscribe((data: any) => {
      this.util.hide();
      console.log(data);
      this.getProfile();
    }, error => {
      this.util.hide();
      console.log(error);
    });
  }

  back() {
    this.navCtrl.back();
  }

}