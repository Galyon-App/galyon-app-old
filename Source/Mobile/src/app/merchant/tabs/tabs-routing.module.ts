import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'orders',
        loadChildren: () => import('../orders/orders.module').then(m => m.OrdersPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('../messages/messages.module').then(m => m.MessagesPageModule)
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
        loadChildren: () => import('../accounts/accounts.module').then(m => m.AccountsPageModule)
      },
      {
        path: 'products',
        loadChildren: () => import('../products/products.module').then(m => m.ProductsPageModule)
      },
      {
        path: 'new-product',
        loadChildren: () => import('../new-product/new-product.module').then(m => m.NewProductPageModule)
      },
      {
        path: 'order-detail',
        loadChildren: () => import('../order-detail/order-detail.module').then(m => m.OrderDetailPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}