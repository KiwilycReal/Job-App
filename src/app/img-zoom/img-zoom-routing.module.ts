import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImgZoomPage } from './img-zoom.page';

const routes: Routes = [
  {
    path: '',
    component: ImgZoomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImgZoomPageRoutingModule {}
