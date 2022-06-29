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
        name: 'Customers',
        type: 'link',
        icon: 'ti-user'
      },
    ],
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
  // }
];

const OPERATOR_ITEMS = [
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
        state: 'city',
        name: 'Cities',
        type: 'link',
        icon: 'ti-location-pin'
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
      {
        state: 'stores',
        name: 'Stores',
        type: 'link',
        icon: 'ti-notepad'
      }
    ],
  },
  // {
  //   label: 'Manage',
  //   main: [
  //     // {
  //     //   state: 'stats',
  //     //   name: 'Reports',
  //     //   type: 'link',
  //     //   icon: 'ti-stats-up'
  //     // },
  //     // {
  //     //   state: 'contacts',
  //     //   name: 'Support',
  //     //   type: 'link',
  //     //   icon: 'ti-comments-smiley'
  //     // },
  //     {
  //       state: 'store',
  //       name: 'Settings',
  //       type: 'link',
  //       icon: 'ti-panel'
  //     },
  //   ]
  // },
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
      {
        state: 'stores',
        name: 'Stores',
        type: 'link',
        icon: 'ti-notepad'
      }
    ],
  },
  // {
  //   label: 'Manage',
  //   main: [
  //     // {
  //     //   state: 'stats',
  //     //   name: 'Reports',
  //     //   type: 'link',
  //     //   icon: 'ti-stats-up'
  //     // },
  //     // {
  //     //   state: 'contacts',
  //     //   name: 'Support',
  //     //   type: 'link',
  //     //   icon: 'ti-comments-smiley'
  //     // },
  //     {
  //       state: 'store',
  //       name: 'Settings',
  //       type: 'link',
  //       icon: 'ti-panel'
  //     },
  //   ]
  // },
];

@Injectable()
export class MenuItems {
  getAdminItems(): Menu[] {
    return ADMIN_ITEMS;
  }

  getOperatorItems(): Menu[] {
    return OPERATOR_ITEMS;
  }

  getMerchantItems(): Menu[] {
    return MERCHANT_ITEMS;
  }

  /*add(menu: Menu) {
    MENUITEMS.push(menu);
  }*/
}
