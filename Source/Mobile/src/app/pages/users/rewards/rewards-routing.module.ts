import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RewardsPage } from './rewards.page';

const routes: Routes = [
  {
    path: '',
    component: RewardsPage
  },
  {
    path: 'raffle',
    loadChildren: () => import('./raffle/raffle.module').then( m => m.RafflePageModule)
  },
  {
    path: 'games',
    loadChildren: () => import('./games/games.module').then( m => m.GamesPageModule)
  },
  {
    path: 'referral',
    loadChildren: () => import('./referral/referral.module').then( m => m.ReferralPageModule)
  },
  {
    path: 'cards',
    loadChildren: () => import('./cards/cards.module').then( m => m.CardsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RewardsPageRoutingModule {}
