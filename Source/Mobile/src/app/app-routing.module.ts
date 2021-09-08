/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { CityGuard } from './guard/city.guard';
import { AuthComponent } from './components/auth/auth.component';
import { Role } from './models/role.model';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  },
  {
    path: 'merchant',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/merchant/tabs/tabs.module').then( m => m.TabsPageModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./pages/merchant/orders/orders.module').then( m => m.OrdersPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('./pages/merchant/messages/messages.module').then( m => m.MessagesPageModule)
      },
      {
        path: 'reviews',
        loadChildren: () => import('./pages/merchant/reviews/reviews.module').then( m => m.ReviewsPageModule)
      },
      {
        path: 'analytics',
        loadChildren: () => import('./pages/merchant/analytics/analytics.module').then( m => m.AnalyticsPageModule)
      },
      {
        path: 'accounts',
        loadChildren: () => import('./pages/merchant/accounts/accounts.module').then( m => m.AccountsPageModule)
      },
    ],
    canActivate: [AuthGuard],
    data: { roles: [Role.Merchant] }
  },
  {
    path: 'driver',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
    ],
    canActivate: [AuthGuard],
    data: { roles: [Role.Driver] }
  },
  {
    path: 'user',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/users/tabs/tabs.module').then( m => m.TabsPageModule)
      }
    ],
    // canActivate: [AuthGuard],
    // data: { roles: [Role.User] }
  },
  {
    path: 'editor',
    children: [
      {
        path: 'add-address',
        loadChildren: () =>
          import('./pages/editor/add-address/add-address.module').then(m => m.AddAddressPageModule)
      },
    ],
  },
  {
    path: 'cities',
    loadChildren: () => import('./pages/external/cities/cities.module').then(m => m.CitiesPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/external/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/external/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./pages/external/reset/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./pages/external/contacts/contacts.module').then(m => m.ContactsPageModule)
  },
  {
    path: 'faqs',
    loadChildren: () => import('./pages/external/faqs/faqs.module').then(m => m.FaqsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/external/about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/external/help/help.module').then(m => m.HelpPageModule)
  },
  {
    path: 'notfound',
    loadChildren: () => import('./pages/external/notfound/notfound.module').then( m => m.NotfoundPageModule)
  },
  { 
    path: '**', 
    redirectTo: 'notfound'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
