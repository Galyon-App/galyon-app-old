/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { CityGuard } from './CityGuard/city.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  

  {
    path: 'cities',
    loadChildren: () => import('./pages/cities/cities.module').then(m => m.CitiesPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  

  {
    path: 'address',
    loadChildren: () => import('./pages/address/address.module').then(m => m.AddressPageModule)
  },
  {
    path: 'favorite',
    loadChildren: () => import('./pages/favorite/favorite.module').then(m => m.FavoritePageModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./pages/contacts/contacts.module').then(m => m.ContactsPageModule)
  },
  {
    path: 'faqs',
    loadChildren: () => import('./pages/faqs/faqs.module').then(m => m.FaqsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help.module').then(m => m.HelpPageModule)
  },


  {
    path: 'chat',
    loadChildren: () => import('./pages/inbox/inbox.module').then(m => m.InboxPageModule)
  },
  {
    path: 'delivery-options',
    loadChildren: () => import('./pages/delivery-options/delivery-options.module').then(m => m.DeliveryOptionsPageModule)
  },
  {
    path: 'order-details',
    loadChildren: () => import('./pages/order-details/order-details.module').then(m => m.OrderDetailsPageModule)
  },






  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesPageModule)
  },
  {
    path: 'store',
    loadChildren: () => import('./pages/store/store.module').then(m => m.StorePageModule)
  },
  {
    path: 'product',
    loadChildren: () => import('./pages/product/product.module').then(m => m.ProductPageModule)
  },
  
  
  {
    path: 'languages',
    loadChildren: () => import('./pages/languages/languages.module').then(m => m.LanguagesPageModule)
  },
  
  {
    path: 'payment',
    loadChildren: () => import('./pages/payment/payment.module').then(m => m.PaymentPageModule)
  },
  {
    path: 'sub-category',
    loadChildren: () => import('./pages/sub-category/sub-category.module').then(m => m.SubCategoryPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  
  {
    path: 'offers',
    loadChildren: () => import('./pages/offers/offers.module').then(m => m.OffersPageModule)
  },
  {
    path: 'top-picked',
    loadChildren: () => import('./pages/top-picked/top-picked.module').then(m => m.TopPickedPageModule)
  },
  {
    path: 'top-stores',
    loadChildren: () => import('./pages/top-stores/top-stores.module').then(m => m.TopStoresPageModule)
  },
  {
    path: 'all-offers',
    loadChildren: () => import('./pages/all-offers/all-offers.module').then(m => m.AllOffersPageModule)
  },
  
  {
    path: 'add-address',
    loadChildren: () => import('./pages/add-address/add-address.module').then(m => m.AddAddressPageModule)
  },
  
  {
    path: 'stripe-payments',
    loadChildren: () => import('./pages/stripe-payments/stripe-payments.module').then(m => m.StripePaymentsPageModule)
  },
  {
    path: 'add-card',
    loadChildren: () => import('./pages/add-card/add-card.module').then(m => m.AddCardPageModule)
  },
  
  {
    path: 'order-rating',
    loadChildren: () => import('./pages/order-rating/order-rating.module').then(m => m.OrderRatingPageModule)
  },
  {
    path: 'store-rating',
    loadChildren: () => import('./pages/store-rating/store-rating.module').then(m => m.StoreRatingPageModule)
  },
  {
    path: 'product-rating',
    loadChildren: () => import('./pages/product-rating/product-rating.module').then(m => m.ProductRatingPageModule)
  },
  {
    path: 'rating-list',
    loadChildren: () => import('./pages/rating-list/rating-list.module').then(m => m.RatingListPageModule)
  },
  {
    path: 'driver-rating',
    loadChildren: () => import('./pages/driver-rating/driver-rating.module').then(m => m.DriverRatingPageModule)
  },
  {
    path: 'sort',
    loadChildren: () => import('./pages/sort/sort.module').then(m => m.SortPageModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./pages/verify/verify.module').then( m => m.VerifyPageModule)
  },
  {
    path: 'direction',
    loadChildren: () => import('./pages/direction/direction.module').then( m => m.DirectionPageModule)
  },

  {
    path: 'notfound',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  },

  {
    path: 'merchant',
    loadChildren: () => import('./merchant/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'merchant/orders',
    loadChildren: () => import('./merchant/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'merchant/messages',
    loadChildren: () => import('./merchant/messages/messages.module').then( m => m.MessagesPageModule)
  },
  {
    path: 'merchant/reviews',
    loadChildren: () => import('./merchant/reviews/reviews.module').then( m => m.ReviewsPageModule)
  },
  {
    path: 'merchant/analytics',
    loadChildren: () => import('./merchant/analytics/analytics.module').then( m => m.AnalyticsPageModule)
  },
  {
    path: 'merchant/accounts',
    loadChildren: () => import('./merchant/accounts/accounts.module').then( m => m.AccountsPageModule)
  },
  
  {
    path: '**',
    redirectTo: 'notfound',
    pathMatch: 'full'
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
