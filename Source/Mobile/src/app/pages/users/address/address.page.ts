/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { NavController, PopoverController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/services/api.service';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { AddressService } from 'src/app/services/address.service';
import { Address } from 'src/app/models/address.model';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

  id: any;
  from: any;
  selectedAddress: any;
  dummy = Array(10);

  constructor(
    private navCtrl: NavController,
    public api: ApiService,
    public util: UtilService,
    private router: Router,
    private route: ActivatedRoute,
    private popoverController: PopoverController,
    public cart: CartService,
    private auth: AuthService,
    public address: AddressService
  ) {
    this.route.queryParams.subscribe(data => {
      if (data && data.from) {
        this.from = data.from;
      }
    });
    if(this.auth.is_authenticated) {
      this.dummy = Array(10);
      this.address.request(this.auth.userToken.uuid, (success) => {
        this.dummy = [];
      });
    }
  }

  ngOnInit() {
  }

  back() {
    this.navCtrl.back();
  }

  ionViewWillEnter() {
    // this.getAddress();
  }

  addNew() {
    this.router.navigate(['editor/add-address']);
  }

  selectAddress() {
    if (this.from === 'payment') {
      const selecte = this.address.current.filter(x => x.uuid === this.selectedAddress);
      const item = selecte[0];
      this.cart.deliveryAddress = item;
      console.log(item);
      //this.cart.calcuate();
      this.router.navigate(['user/cart/payment']);
    }
  }

  async openMenu(item, events) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: events,
      mode: 'ios',
    });
    popover.onDidDismiss().then(data => {
      console.log(data.data);
      if (data && data.data) {
        if (data.data === 'edit') {
          const navData: NavigationExtras = {
            queryParams: {
              from: 'edit',
              data: JSON.stringify(item)
            }
          };
          this.router.navigate(['editor/add-address'], navData);
        } else if (data.data === 'delete') {
          Swal.fire({
            title: 'Are you sure?',
            text: 'to delete this address',
            icon: 'question',
            confirmButtonText: 'Yes',
            backdrop: false,
            background: 'white',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'cancel'
          }).then(data => {
            if (data && data.value) {
              this.util.show();
              this.api.post('galyon/v1/address/deleteAddressCurrent', {
                uuid: item.uuid
              }).subscribe((response: any) => {
                if(response && response.success && response.data) {
                  let latest: Address[] = this.address.current.filter(x => x.uuid != item.uuid);
                  this.address.setCurrent(latest);
                } else {
                  this.address.request(this.auth.userToken.uuid);
                }
                this.util.hide();
              }, error => {
                console.log(error);
                this.util.hide();
                this.util.errorToast(this.util.getString('Something went wrong'));
              });
            }
          });

        }
      }
    });
    await popover.present();
  }

}
