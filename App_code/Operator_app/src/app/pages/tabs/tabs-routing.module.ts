/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'store',
    component: TabsPage,
    children: [
      {
        path: 'orders',
        loadChildren: () => import('../orders/orders.module').then(m => m.OrdersPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('../chats/chats.module').then(m => m.ChatsPageModule)
      },
      {
        path: 'reviews',
        loadChildren: () => import('../reviews/reviews.module').then(m => m.ReviewsPageModule)
      },
      {
        path: 'analytics',
        loadChildren: () => import('../analytics/analytics.module').then(m => m.AnalyticsPageModule)
      },
      {
        path: 'accounts',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../account/account.module').then(m => m.AccountPageModule),
          },
          {
            path: 'about',
            loadChildren: () =>
              import('../about/about.module').then(m => m.AboutPageModule)
          },
          {
            path: 'contacts',
            loadChildren: () =>
              import('../contacts/contacts.module').then(m => m.ContactsPageModule)
          },
          {
            path: 'products',
            loadChildren: () =>
              import('../products/products.module').then(m => m.ProductsPageModule)
          },
          {
            path: 'new-product',
            loadChildren: () =>
              import('../new-product/new-product.module').then(m => m.NewProductPageModule)
          },
          {
            path: 'languages',
            loadChildren: () =>
              import('../languages/languages.module').then(m => m.LanguagesPageModule)
          },
          {
            path: 'faqs',
            loadChildren: () =>
              import('../faqs/faqs.module').then(m => m.FaqsPageModule)
          },
          {
            path: 'help',
            loadChildren: () =>
              import('../help/help.module').then(m => m.HelpPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/store/orders',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/store/orders',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
