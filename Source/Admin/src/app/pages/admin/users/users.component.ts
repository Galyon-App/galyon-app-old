/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavigationExtras, Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import Swal from 'sweetalert2';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  
  dummy = Array(5);
  dummyUsers: any[] = [];
  
  page: number = 1;
  users: any[] = [];

  searchFilter: any = '';
  activeRoleFilter: any = '';

  constructor(
    public api: ApisService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public util: UtilService,
  ) {    
    this.getUsers();
  }

  /**
   * Get list of users. For admin role, list include admin type of user.
   * @param filter string to used to filter.
   */
  getUsers(filter = '') {
    this.api.post('galyon/v1/users/getAll', {
      search: filter,
      role: this.activeRoleFilter,
      limit_start: 0,
      limit_length: 1000
    }).then((response: any) => {
      if (response && response.success == true && response.data) {
        let user_list = response.data;
        user_list.forEach(item => {
          if(item.type == 'admin') {
            item.type = 'Admin';
          } else if(item.type == 'operator') {
            item.type = 'Operator';
          } else if(item.type == 'store') {
            item.type = 'Merchant';
          } else if(item.type == 'driver') {
            item.type = 'Driver';
          } else if(item.type == 'user') {
            item.type = 'User';
          }
        });
        this.dummy = [];
        this.users = response.data;
        this.dummyUsers = response.data;
      }
    }).catch(error => {
      console.log(error);
      this.util.error('Something went wrong');
    });
  }

  /**
   * Search the term to the columns specified on filterItems.
   * @param searchTerm 
   */
  search(searchTerm) {
    this.resetChanges();
    this.users = this.filterItems(searchTerm);
  }

  /**
   * Reset list of users displayed to dummy.
   */
  protected resetChanges = () => {
    this.users = this.dummyUsers;
  }

  /**
   * Filter the columns with the given terms.
   * @param searchTerm 
   * @returns 
   */
  filterItems(searchTerm) {
    return this.users.filter((item) => {
      if(item.first_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
      item.last_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || 
      item.email.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || 
      item.phone.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
      item.type.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
        return true;
      }
      return false;
    });
  }

  //TODO
  getClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round btn-outline_success';
    } else {
      return 'btn btn-danger btn-round btn-outline-danger';
    }
  }

  /**
   * Change the status of the user to activate or deactivate.
   * @param item 
   */
  changeStatus(item) {
    const actions = item.status === '1' ? 'deactivate' : 'activate';

    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate('To ') + actions + this.api.translate(' this user!'),
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: this.api.translate('Yes'),
      showCancelButton: true,
      cancelButtonText: this.api.translate('Cancel'),
      backdrop: false,
      background: 'white'
    }).then((data) => {
      if (data && data.value) {
        this.spinner.show();
        this.api.post('galyon/v1/users/'+actions, {
          uuid: item.uuid
        }).then((response) => {
          if(response.success) {
            let index = this.users.findIndex((x => x.uuid == item.uuid));
            this.users[index].status = response.data.status;
          } else {
            this.util.error( response.message );
          }
          this.spinner.hide();
        }, error => {
          console.log(error);
          this.spinner.hide();
        }).catch(error => {
          this.spinner.hide();
          console.log(error);
        });
      }
    });
  }

  /**
   * Open user to edit or preview data.
   * @param item 
   */
  openUser(item) {
    const navData: NavigationExtras = {
      queryParams: {
        uuid: item.uuid
      }
    };
    this.router.navigate(['admin/manage-users'], navData);
  }

  /**
   * Call to filter by Role.
   */
  filterByRole() {
    this.getUsers(this.searchFilter);
  }
}
