/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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

const ADMIN_ITEMS = [
  {
    label: 'General',
    main: [
      {
        state: 'dashboard',
        name: 'Dashboard',
        type: 'link',
        icon: 'ti-home'
      },
      {
        state: 'orders',
        name: 'Orders',
        type: 'link',
        icon: 'ti-shopping-cart'
      },
      {
        state: 'city',
        name: 'Cities',
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
        state: 'category',
        name: 'Categories',
        type: 'link',
        icon: 'ti-layout-grid2'
      },
      {
        state: 'products',
        name: 'Products',
        type: 'link',
        icon: 'ti-envelope'
      },
      {
        state: 'users',
        name: 'Users',
        type: 'link',
        icon: 'ti-user'
      },
    ],
  },
  {
    label: 'Content',
    main: [      
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
      // {
      //   state: 'manage-popup',
      //   name: 'Popups',
      //   type: 'link',
      //   icon: 'ti-quote-right'
      // },
      {
        state: 'pages',
        name: 'Pages',
        type: 'link',
        icon: 'ti-blackboard'
      },
      // {
      //   state: 'manage-website',
      //   name: 'Featured',
      //   type: 'link',
      //   icon: 'ti-layout-width-default'
      // }   
    ]
  },
  // {
  //   label: 'Support',
  //   main: [ 
  //     {
  //       state: 'emails',
  //       name: 'Contacts',
  //       type: 'link',
  //       icon: 'ti-email'
  //     },
  //     {
  //       state: 'contacts',
  //       name: 'Chat Support',
  //       type: 'link',
  //       icon: 'ti-comments-smiley'
  //     }, 
  //   ]
  // },
  // {
  //   label: 'Marketing',
  //   main: [  
  //     {
  //       state: 'notifications',
  //       name: 'Notification',
  //       type: 'link',
  //       icon: 'ti-bell'
  //     }, 
  //     {
  //       state: 'send-mail',
  //       name: 'Send Emails',
  //       type: 'link',
  //       icon: 'ti-email'
  //     },
  //   ]
  // },
  // {
  //   label: 'Reports',
  //   main: [
  //     {
  //       state: 'stats',
  //       name: 'Store Stats',
  //       type: 'link',
  //       icon: 'ti-stats-up'
  //     },
  //     {
  //       state: 'driver-stats',
  //       name: 'Drivers Stats',
  //       type: 'link',
  //       icon: 'ti-stats-up'
  //     },
  //   ]
  // },
  {
    label: 'System',
    main: [
      {
        state: 'general',
        name: 'General',
        type: 'link',
        icon: 'ti-settings'
      },
      {
        state: 'payment',
        name: 'Payments',
        type: 'link',
        icon: 'ti-money'
      },
      {
        state: 'maintainance',
        name: 'Maintainance',
        type: 'link',
        icon: 'ti-lock'
      },
      {
        state: 'settings',
        name: 'Settings',
        type: 'link',
        icon: 'ti-desktop'
      },
      // { //Dynamically add / edit language translation data.
      //   state: 'languages',
      //   name: 'Languages',
      //   type: 'link',
      //   icon: 'ti-world'
      // },
    ]
  }
];

const MERCHANT_ITEMS = [
  {
    label: 'General',
    main: [
      {
        state: 'dashboard',
        name: 'Dashboard',
        type: 'link',
        icon: 'ti-home'
      },
      {
        state: 'orders',
        name: 'Orders',
        type: 'link',
        icon: 'ti-shopping-cart'
      },
      {
        state: 'products',
        name: 'Products',
        type: 'link',
        icon: 'ti-envelope'
      },
      // {
      //   state: 'reviews',
      //   name: 'Reviews',
      //   type: 'link',
      //   icon: 'ti-face-smile'
      // }
    ],
  },
  {
    label: 'Manage',
    main: [
      // {
      //   state: 'stats',
      //   name: 'Reports',
      //   type: 'link',
      //   icon: 'ti-stats-up'
      // },
      // {
      //   state: 'contacts',
      //   name: 'Support',
      //   type: 'link',
      //   icon: 'ti-comments-smiley'
      // },
      {
        state: 'store',
        name: 'Settings',
        type: 'link',
        icon: 'ti-panel'
      },
    ]
  },

];

@Injectable()
export class MenuItems {
  getAdminItems(): Menu[] {
    return ADMIN_ITEMS;
  }

  getMerchantItems(): Menu[] {
    return MERCHANT_ITEMS;
  }

  /*add(menu: Menu) {
    MENUITEMS.push(menu);
  }*/
}
