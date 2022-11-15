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
            path: 'subcategory',
            loadChildren: () =>
              import('../subcategory/subcategory.module').then(m => m.SubcategoryPageModule)
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
        path: 'shops',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../shops/shops.module').then(m => m.ShopsPageModule)
          }
        ],
      },
      {
        path: 'rewards',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../rewards/rewards.module').then(m => m.RewardsPageModule)
          },
          {
            path: 'raffle',
            loadChildren: () =>
              import('../rewards/raffle/raffle.module').then(m => m.RafflePageModule)
          },
          {
            path: 'games',
            loadChildren: () =>
              import('../rewards/games/games.module').then(m => m.GamesPageModule)
          },
          {
            path: 'referral',
            loadChildren: () =>
              import('../rewards/referral/referral.module').then(m => m.ReferralPageModule)
          }
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
            path: 'offers',
            loadChildren: () =>
              import('../offers/offers.module').then(m => m.OffersPageModule)
          },
        ],
      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../orders/orders.module').then(m => m.OrdersPageModule)
          },
          {
            path: 'details',
            loadChildren: () =>
              import('../order-details/order-details.module').then(m => m.OrderDetailsPageModule)
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
              import('../../users/address/address.module').then(m => m.AddressPageModule)
          },
          {
            path: 'favorites',
            loadChildren: () =>
              import('../../users/favorite/favorite.module').then(m => m.FavoritePageModule)
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
          }
        ],
        canActivate: [AuthGuard]
      },
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
