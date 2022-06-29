/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './layouts/admin/admin.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { AuthGuard } from './guard/auth.guard';
import { Role } from './models/role.model';
import { LoginComponent } from './pages/external/login/login.component';
import { MerchantComponent } from './layouts/merchant/merchant.component';
import { ResetComponent } from './pages/merchant/reset/reset.component';
import { MaintainanceComponent } from './pages/external/maintainance/maintainance.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [AuthGuard],
  },

  //Admin
  {
      path: 'admin',
      component: AdminComponent,
      children: [
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full'
        },
        {
          path: 'dashboard',
          loadChildren: () => import('./pages/admin/dashboard/dashboard.module').then(m => m.DashboardModule),
        },


        {
          path: 'users',
          loadChildren: () => import('./pages/admin/users/users.module').then(m => m.UsersModule)
        },
        {
          path: 'manage-users',
          loadChildren: () => import('./pages/admin/manage-users/manage-users.module').then(m => m.ManageUsersModule)
        },


        {
          path: 'city',
          loadChildren: () => import('./pages/admin/cities/cities.module').then(m => m.CitiesModule)
        },
        {
          path: 'manage-city',
          loadChildren: () => import('./pages/admin/manage-city/manage-city.module').then(m => m.ManageCityModule)
        },


        {
          path: 'stores',
          loadChildren: () => import('./pages/tables/stores/stores.module').then(m => m.StoresModule)
        },
        {
          path: 'manage-stores',
          loadChildren: () => import('./pages/editor/manage-stores/manage-stores.module').then(m => m.ManageStoresModule)
        },


        {
          path: 'category',
          loadChildren: () => import('./pages/admin/category/category.module').then(m => m.CategoryModule)
        },
        {
          path: 'manage-category',
          loadChildren: () => import('./pages/admin/manage-category/manage-category.module').then(m => m.ManageCategoryModule)
        },


        {
          path: 'manage-address',
          loadChildren: () => import('./pages/editor/manage-address/manage-address.module').then(m => m.ManageAddressModule)
        },


        {
          path: 'products',
          loadChildren: () => import('./pages/tables/products/products.module').then(m => m.ProductsModule)
        },
        {
          path: 'manage-products',
          loadChildren: () => import('./pages/editor/manage-products/manage-products.module').then(m => m.ManageProductsModule)
        },


        {
          path: 'orders',
          loadChildren: () => import('./pages/tables/orders/orders.module').then(m => m.OrdersModule)
        },
        {
          path: 'manage-orders',
          loadChildren: () => import('./pages/editor/manage-orders/manage-orders.module').then(m => m.ManageOrdersModule)
        },
        

        {
          path: 'notifications',
          loadChildren: () => import('./pages/admin/notifications/notifications.module').then(m => m.NotificationsModule)
        },


        {
          path: 'contacts',
          loadChildren: () => import('./backups/contacts/contacts.module').then(m => m.ContactsModule),
        },
        {
          path: 'manage-contacts',
          loadChildren: () => import('./backups/manage-contacts/manage-contacts.module').then(m => m.ManageContactsModule)
        },


        {
          path: 'emails',
          loadChildren: () => import('./pages/admin/emails/emails.module').then(m => m.EmailsModule)
        },
        {
          path: 'emails-details',
          loadChildren: () => import('./pages/admin/emails-details/emails-details.module').then(m => m.EmailsDetailsModule)
        },
        {
          path: 'send-mail',
          loadChildren: () => import('./pages/admin/send-email/send-email.module').then(m => m.SendEmailModule)
        }
      ],
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
  },

  //Operator
  {
    path: 'operator',
    component: MerchantComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
    ],
    canActivate: [AuthGuard],
    data: { roles: [Role.Operator] }
  },
  
  //Merchant
  {
    path: 'merchant',
    component: MerchantComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/merchant/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'stats',
        loadChildren: () => import('./pages/merchant/stats/stats.module').then(m => m.StatsModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./pages/tables/orders/orders.module').then(m => m.OrdersModule)
      },
      {
        path: 'manage-orders',
        loadChildren: () => import('./pages/editor/manage-orders/manage-orders.module').then(m => m.ManageOrdersModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./pages/tables/products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'manage-products',
        loadChildren: () => import('./pages/editor/manage-products/manage-products.module').then(m => m.ManageProductsModule)
      },
      {
        path: 'stores',
        loadChildren: () => import('./pages/tables/stores/stores.module').then(m => m.StoresModule)
      },
      {
        path: 'manage-stores',
        loadChildren: () => import('./pages/editor/manage-stores/manage-stores.module').then(m => m.ManageStoresModule)
      },

      {
        path: 'reviews',
        loadChildren: () => import('./pages/merchant/reviews/reviews.module').then(m => m.ReviewsModule)
      },
      {
        path: 'contacts',
        loadChildren: () => import('./pages/merchant/contacts/contacts.module').then(m => m.ContactsModule)
      }
    ],
    canActivate: [AuthGuard],
    data: { roles: [Role.Merchant] }
  },

  //External
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reset',
    component: ResetComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'maintainance',
    component: MaintainanceComponent,
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
