/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  target?: boolean;
  name: string;
  type?: string;
  children?: ChildrenItems[];
}

export interface MainMenuItems {
  state: string;
  main_state?: string;
  target?: boolean;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

export interface Menu {
  label: string;
  main: MainMenuItems[];
}

const MENUITEMS = [
  {
    label: 'Main',
    main: [
      {
        state: 'dashboard',
        name: 'Dashboard',
        type: 'link',
        icon: 'ti-home'
      },
      {
        state: 'city',
        name: 'Available Cities',
        type: 'link',
        icon: 'ti-location-pin'
      },
      {
        state: 'stores',
        name: 'Stores',
        type: 'link',
        icon: 'ti-notepad'
      },
      {
        state: 'users',
        name: 'Users',
        type: 'link',
        icon: 'ti-user'
      },
      {
        state: 'drivers',
        name: 'Drivers',
        type: 'link',
        icon: 'ti-truck'
      },
      {
        state: 'orders',
        name: 'Orders',
        type: 'link',
        icon: 'ti-shopping-cart'
      },
      {
        state: 'category',
        name: 'Categories',
        type: 'link',
        icon: 'ti-layout-grid2'
      },
      {
        state: 'sub-category',
        name: 'Sub Categories',
        type: 'link',
        icon: 'ti-layout-grid2-thumb'
      },
      {
        state: 'products',
        name: 'Products',
        type: 'link',
        icon: 'ti-envelope'
      },
      {
        state: 'payment',
        name: 'Payments',
        type: 'link',
        icon: 'ti-money'
      }
    ],
  },
  {
    label: 'Manage',
    main: [
      {
        state: 'languages',
        name: 'Languages',
        type: 'link',
        icon: 'ti-world'
      },
      {
        state: 'banners',
        name: 'Banners',
        type: 'link',
        icon: 'ti-layout-list-large-image',
      },
      {
        state: 'offers',
        name: 'Coupons',
        type: 'link',
        icon: 'ti-medall'
      },
      {
        state: 'notifications',
        name: 'Notification',
        type: 'link',
        icon: 'ti-bell'
      },
      {
        state: 'contacts',
        name: 'Support',
        type: 'link',
        icon: 'ti-comments-smiley'
      },
      {
        state: 'emails',
        name: 'Contacts',
        type: 'link',
        icon: 'ti-email'
      },
      {
        state: 'stats',
        name: 'Store Stats',
        type: 'link',
        icon: 'ti-stats-up'
      },

      {
        state: 'driver-stats',
        name: 'Drivers Stats',
        type: 'link',
        icon: 'ti-stats-up'
      },


      {
        state: 'manage-app',
        name: 'Manage App',
        type: 'link',
        icon: 'ti-lock'
      },
      {
        state: 'send-mail',
        name: 'Send Emails',
        type: 'link',
        icon: 'ti-email'
      },
      {
        state: 'app-settings',
        name: 'App Settings',
        type: 'link',
        icon: 'ti-desktop'
      },
      {
        state: 'general',
        name: 'General',
        type: 'link',
        icon: 'ti-settings'
      },
      {
        state: 'app-pages',
        name: 'App Pages',
        type: 'link',
        icon: 'ti-blackboard'
      },
      {
        state: 'manage-popup',
        name: 'Manage Popup',
        type: 'link',
        icon: 'ti-quote-right'
      },
      {
        state: 'administrantor',
        name: 'Administrator',
        type: 'link',
        icon: 'ti-id-badge'
      },
      {
        state: 'manage-website',
        name: 'Manage Websites',
        type: 'link',
        icon: 'ti-layout-width-default'
      }

    ]
  },

];

@Injectable()
export class MenuItems {
  getAll(): Menu[] {
    return MENUITEMS;
  }

  /*add(menu: Menu) {
    MENUITEMS.push(menu);
  }*/
}
