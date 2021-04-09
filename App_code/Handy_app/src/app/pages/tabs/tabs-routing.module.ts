/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorsComponent } from '../errors/errors.component';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'driver',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'message',
        loadChildren: () => import('../chats/chats.module').then(m => m.ChatsPageModule)
      },
      {
        path: 'reviews',
        loadChildren: () => import('../reviews/reviews.module').then(m => m.ReviewsPageModule)
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () => import('../account/account.module').then(m => m.AccountPageModule)
          },
          {
            path: 'contact',
            loadChildren: () => import('../contacts/contacts.module').then(m => m.ContactsPageModule)
          },
          {
            path: 'about',
            loadChildren: () => import('../about/about.module').then(m => m.AboutPageModule)
          },
          {
            path: 'languages',
            loadChildren: () => import('../languages/languages.module').then(m => m.LanguagesPageModule)
          },
          {
            path: 'edit-profile',
            loadChildren: () => import('../edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
          },
          {
            path: 'faqs',
            loadChildren: () => import('../faqs/faqs.module').then(m => m.FaqsPageModule)
          },
          {
            path: 'help',
            loadChildren: () => import('../help/help.module').then(m => m.HelpPageModule)
          }
        ]

      },
      {
        path: '',
        redirectTo: '/driver/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/driver/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
