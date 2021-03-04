/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { UsersComponent } from './layouts/users/users.component';
import { ErrorsComponent } from './layouts/errors/errors.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'order',
        loadChildren: () => import('./components/order/order.module').then(m => m.OrderModule),
        data: { title: 'Orders' }
      },
      {
        path: 'order-detail',
        loadChildren: () => import('./components/order-detail/order-detail.module').then(m => m.OrderDetailModule),
        data: { title: 'Order Details' }
      },
      {
        path: 'home',
        loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule),
        data: { title: 'Home' }
      },
      {
        path: 'cart',
        loadChildren: () => import('./components/cart/cart.module').then(m => m.CartModule),
        data: { title: 'Cart' }
      },
      {
        path: 'shop-detail',
        loadChildren: () => import('./components/shop-detail/shop-detail.module').then(m => m.ShopDetailModule),
        data: { title: 'Shop Details' }
      },
      {
        path: 'checkout',
        loadChildren: () => import('./components/checkout/checkout.module').then(m => m.CheckoutModule),
        data: { title: 'Checkout' }
      },
      {
        path: 'shop/:id/:name',
        loadChildren: () => import('./components/shop/shop.module').then(m => m.ShopModule),
        data: { title: 'Shop' }
      },
      {
        path: 'about',
        loadChildren: () => import('./components/about/about.module').then(m => m.AboutModule),
        data: { title: 'About us' }
      },
      {
        path: 'product/:name/:id',
        loadChildren: () => import('./components/product/product.module').then(m => m.ProductModule),
        data: { title: 'Product' }
      },
      {
        path: 'categories/:id/:name',
        loadChildren: () => import('./components/categories/categories.module').then(m => m.CategoriesModule),
        data: { title: 'Categories' }
      },
      {
        path: 'sub/:id/:name/:sub_id/:sub_name',
        loadChildren: () => import('./components/categories/categories.module').then(m => m.CategoriesModule),
        data: { title: 'Categories' }
      },
      {
        path: 'paytmcallback',
        loadChildren: () => import('./components/paytmcallback/paytmcallback.module').then(m => m.PaytmcallbackModule),
        data: { title: 'Success' },
      },
      {
        path: 'instamojocallback',
        loadChildren: () => import('./components/instamojocallback/instamojocallback.module').then(m => m.InstamojocallbackModule),
        data: { title: 'Success' }
      },
      {
        path: 'flutterwavecallback',
        loadChildren: () => import('./components/flutterwavecallback/flutterwavecallback.module').then(m => m.FlutterwavecallbackModule),
        data: { title: 'Success' }
      },
      {
        path: 'user/:id/:from',
        loadChildren: () => import('./components/settings/settings.module').then(m => m.SettingsModule),
        data: { title: 'User Informations' }
      },
      {
        path: 'privacy-policy',
        loadChildren: () => import('./components/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule),
        data: { title: 'Privacy Policy' }
      },
      {
        path: 'contact',
        loadChildren: () => import('./components/contact/contact.module').then(m => m.ContactModule),
        data: { title: 'Contact' }
      },
      {
        path: 'refund-policy',
        loadChildren: () => import('./components/refund-policy/refund-policy.module').then(m => m.RefundPolicyModule),
        data: { title: 'Refund Policy' }
      },
      {
        path: 'help',
        loadChildren: () => import('./components/help/help.module').then(m => m.HelpModule),
        data: { title: 'Help' }
      },
      {
        path: 'chats',
        loadChildren: () => import('./components/chats/chats.module').then(m => m.ChatsModule),
        data: { title: 'Chats' }
      },
      {
        path: 'faq',
        loadChildren: () => import('./components/faq/faq.module').then(m => m.FaqModule),
        data: { title: 'Faqs' }
      },
      {
        path: 'about',
        loadChildren: () => import('./components/about/about.module').then(m => m.AboutModule),
        data: { title: 'About' }
      },
      {
        path: 'home-products/:from',
        loadChildren: () => import('./components/home-products/home-products.module').then(m => m.HomeProductsModule),
        data: { title: 'Top Products' }
      },
      {
        path: 'stores-near-me',
        loadChildren: () => import('./components/stores/stores.module').then(m => m.StoresModule),
        data: { title: 'Stores Near me' }
      }
    ]
  },
  {
    path: '**',
    component: ErrorsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
