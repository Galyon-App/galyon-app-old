/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { CityGuard } from 'src/app/guard/city.guard';
import { TabsPage } from './tabs.page';
import { CartGuard } from 'src/app/guard/cart.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'top-stores',
            loadChildren: () =>
              import('../top-stores/top-stores.module').then(m => m.TopStoresPageModule)
          },
          {
            path: 'store',
            loadChildren: () =>
              import('../store/store.module').then(m => m.StorePageModule)
          },
          {
            path: 'categories',
            loadChildren: () =>
              import('../categories/categories.module').then(m => m.CategoriesPageModule)
          },
          {
            path: 'sub-category',
            loadChildren: () =>
              import('../sub-category/sub-category.module').then(m => m.SubCategoryPageModule)
          },
          {
            path: 'all-offers',
            loadChildren: () =>
              import('../all-offers/all-offers.module').then(m => m.AllOffersPageModule)
          },
          {
            path: 'top-picked',
            loadChildren: () =>
              import('../top-picked/top-picked.module').then(m => m.TopPickedPageModule)
          },
          {
            path: 'ratings',
            loadChildren: () =>
              import('../rating-list/rating-list.module').then(m => m.RatingListPageModule)
          },
          {
            path: 'products',
            loadChildren: () =>
              import('../products/products.module').then(m => m.ProductsPageModule)
          },
          {
            path: 'product',
            loadChildren: () =>
              import('../product/product.module').then(m => m.ProductPageModule)
          }
        ]
      },
      {
        path: 'message',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../chats/chats.module').then(m => m.ChatsPageModule)
          },
          {
            path: 'chat',
            loadChildren: () =>
              import('../inbox/inbox.module').then(m => m.InboxPageModule)
          },
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'cart',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../cart/cart.module').then(m => m.CartPageModule),
          },
          {
            path: 'delivery-options',
            loadChildren: () =>
              import('../delivery-options/delivery-options.module').then(m => m.DeliveryOptionsPageModule),
            canActivate: [CartGuard]
          },
          {
            path: 'payment',
            loadChildren: () =>
              import('../payment/payment.module').then(m => m.PaymentPageModule),
            canActivate: [CartGuard]
          },
          {
            path: 'address',
            loadChildren: () =>
              import('../address/address.module').then(m => m.AddressPageModule),
            canActivate: [CartGuard]
          },
          {
            path: 'stripe-payments',
            loadChildren: () =>
              import('../stripe-payments/stripe-payments.module').then(m => m.StripePaymentsPageModule),
            canActivate: [CartGuard]
          },
          {
            path: 'add-card',
            loadChildren: () =>
              import('../add-card/add-card.module').then(m => m.AddCardPageModule)
          }
        ],
      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../orders/orders.module').then(m => m.OrdersPageModule)
          }
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../account/account.module').then(m => m.AccountPageModule),
            canActivate: [AuthGuard]
          },
          {
            path: 'profile',
            loadChildren: () =>
              import('../profile/profile.module').then(m => m.ProfilePageModule),
            canActivate: [AuthGuard]
          },

          {
            path: 'address',
            loadChildren: () =>
              import('../../external/about/about.module').then(m => m.AboutPageModule)
          },
          {
            path: 'favorites',
            loadChildren: () =>
              import('../../external/about/about.module').then(m => m.AboutPageModule)
          },
        
          {
            path: 'contacts',
            loadChildren: () =>
              import('../../external/contacts/contacts.module').then(m => m.ContactsPageModule)
          },
          {
            path: 'about',
            loadChildren: () =>
              import('../../external/about/about.module').then(m => m.AboutPageModule)
          },
          {
            path: 'faqs',
            loadChildren: () =>
              import('../../external/faqs/faqs.module').then(m => m.FaqsPageModule)
          },
          {
            path: 'help',
            loadChildren: () =>
              import('../../external/help/help.module').then(m => m.HelpPageModule)
          }
        ],
        canActivate: [AuthGuard]
      }
    ],
    canActivate: [CityGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
