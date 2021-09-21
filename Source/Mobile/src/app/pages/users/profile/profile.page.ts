/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  fname: any;
  lname: any;
  mobile: any;
  gender: any;
  email: any;
  cover: any = '';
  edit_flag: boolean;

  constructor(
    public api: ApiService,
    public util: UtilService,
    private navCtrl: NavController,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private authServ: AuthService,
    public user: UserService
  ) {
    this.edit_flag = true;
    this.user.request(this.authServ.userToken.uuid, (user) => {
      this.util.userInfo = user;
      this.fname = user.first_name;
      this.lname = user.last_name;
      this.mobile = user.phone;
      this.gender = user.gender;
      this.cover = user.cover;
      this.email = user.email;
    });
  }

  ngOnInit() {
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
      cover: this.cover,
      mobile: this.mobile,
      id: localStorage.getItem('uid')
    };
    this.util.show(this.util.getString('updating...'));
    this.api.post('users/edit_profile', param).subscribe((data: any) => {
      this.util.hide();
      console.log(data);
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  back() {
    this.navCtrl.back();
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
        this.util.show('uploading');
        const alpha = {
          img: url,
          type: 'jpg'
        };
        console.log('parma==>', alpha);
        this.api.nativePost('users/upload_file', alpha).then((data) => {
          this.util.hide();
          console.log('data', JSON.parse(data.data));
          const info = JSON.parse(data.data);
          this.cover = info.data;
          console.log('cover image', this.cover);
          const param = {
            cover: this.cover,
            id: localStorage.getItem('uid')
          };
          this.util.show(this.util.getString('updating...'));
          this.api.post('users/edit_profile', param).subscribe((update: any) => {
            this.util.hide();
            console.log(update);
          }, error => {
            this.util.hide();
            console.log(error);
            this.util.errorToast(this.util.getString('Something went wrong'));
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
      this.util.errorToast(this.util.getString('Something went wrong'));
    }
  }

}
