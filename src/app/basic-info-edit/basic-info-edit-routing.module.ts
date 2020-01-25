import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasicInfoEditPage } from './basic-info-edit.page';

const routes: Routes = [
  {
    path: '',
    component: BasicInfoEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicInfoEditPageRoutingModule {}
