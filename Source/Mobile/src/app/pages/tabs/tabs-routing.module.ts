/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { cartGuard } from 'src/app/cartGuard/auth.guard';


const routes: Routes = [
  {
    path: 'user',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'sub-category',
            loadChildren: () =>
              import('../sub-category/sub-category.module').then(m => m.SubCategoryPageModule)
          },
          {
            path: 'store',
            loadChildren: () =>
              import('../store/store.module').then(m => m.StorePageModule)
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
            path: 'message',
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
            canActivate: [cartGuard]
          },
          {
            path: 'payment',
            loadChildren: () =>
              import('../payment/payment.module').then(m => m.PaymentPageModule),
            canActivate: [cartGuard]
          },
          {
            path: 'address',
            loadChildren: () =>
              import('../address/address.module').then(m => m.AddressPageModule),
            canActivate: [cartGuard]
          },
          {
            path: 'stripe-payments',
            loadChildren: () =>
              import('../stripe-payments/stripe-payments.module').then(m => m.StripePaymentsPageModule),
            canActivate: [cartGuard]
          },
          {
            path: 'add-card',
            loadChildren: () =>
              import('../add-card/add-card.module').then(m => m.AddCardPageModule)
          }
        ],
        canActivate: [AuthGuard]
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
        ],
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/user/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/user/home',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
