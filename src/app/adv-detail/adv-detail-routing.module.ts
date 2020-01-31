import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvDetailPage } from './adv-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AdvDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvDetailPageRoutingModule {}
