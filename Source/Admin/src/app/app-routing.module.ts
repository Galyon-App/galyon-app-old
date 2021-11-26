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
import { SetupGuard } from './guard/setup.guard';
import { LeaveGuard } from './guard/leaved.guard';
import { Role } from './models/role.model';
import { LoginComponent } from './pages/admin/login/login.component';
import { SetupComponent } from './pages/admin/setup/setup.component';
import { MerchantComponent } from './layouts/merchant/merchant.component';
import { ResetComponent } from './pages/merchant/reset/reset.component';
import { ManageAddressModule } from './pages/editor/manage-address/manage-address.module';

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
          path: 'banners',
          loadChildren: () => import('./pages/admin/banners/banners.module').then(m => m.BannersModule)
        },
        {
          path: 'manage-banners',
          loadChildren: () => import('./pages/admin/manage-banners/manage-banners.module').then(m => m.ManageBannersModule)
        },
        {
          path: 'offers',
          loadChildren: () => import('./pages/admin/offers/offers.module').then(m => m.OffersModule)
        },
        {
          path: 'manage-offers',
          loadChildren: () => import('./pages/admin/manage-offers/manage-offers.module').then(m => m.ManageOffersModule)
        },
        {
          path: 'pages',
          loadChildren: () => import('./pages/admin/pages/app-pages.module').then(m => m.AppPagesModule)
        },
        {
          path: 'manage-pages',
          loadChildren: () => import('./pages/admin/manage-pages/manage-app-pages.module').then(m => m.ManageAppPagesModule)
        },
        {
          path: 'manage-popup',
          loadChildren: () => import('./pages/admin/manage-popup/manage-popup.module').then(m => m.ManagePopupModule)
        },
        {
          path: 'general',
          loadChildren: () => import('./pages/admin/app-web/app-web.module').then(m => m.AppWebModule)
        },
        {
          path: 'settings',
          loadChildren: () => import('./pages/admin/app-settings/app-settings.module').then(m => m.AppSettingsModule)
        },
        {
          path: 'maintainance',
          loadChildren: () => import('./pages/admin/manage-app/manage-app.module').then(m => m.ManageAppModule)
        },
        {
          path: 'payment',
          loadChildren: () => import('./pages/admin/payments/payments.module').then(m => m.PaymentsModule)
        },
        {
          path: 'manage-payment',
          loadChildren: () => import('./pages/admin/manage-payment/manage-payment.module').then(m => m.ManagePaymentModule)
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
          path: 'manage-website',
          loadChildren: () => import('./pages/admin/manage-website/manage-website.module').then(m => m.ManageWebsiteModule)
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
          path: 'dashboard',
          loadChildren: () => import('./pages/admin/dashboard/dashboard.module').then(m => m.DashboardModule),
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
          path: 'emails-details',
          loadChildren: () => import('./pages/admin/emails-details/emails-details.module').then(m => m.EmailsDetailsModule)
        },
        {
          path: 'emails',
          loadChildren: () => import('./pages/admin/emails/emails.module').then(m => m.EmailsModule)
        },
        {
          path: 'send-mail',
          loadChildren: () => import('./pages/admin/send-email/send-email.module').then(m => m.SendEmailModule)
        },
        {
          path: 'languages',
          loadChildren: () => import('./backups/languages/languages.module').then(m => m.LanguagesModule)
        },
        {
          path: 'manage-languages',
          loadChildren: () => import('./backups/manage-languages/manage-languages.module').then(m => m.ManageLanguagesModule)
        },
        {
          path: 'stats',
          loadChildren: () => import('./pages/admin/stats/stats.module').then(m => m.StatsModule)
        },
        {
          path: 'driver-stats',
          loadChildren: () => import('./pages/admin/driver-stats/driver-stats.module').then(m => m.DriverStatsModule)
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
    canActivate: [SetupGuard],
  },
  {
    path: 'reset',
    component: ResetComponent,
    canActivate: [SetupGuard],
  },
  {
    path: 'setup',
    component: SetupComponent,
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
