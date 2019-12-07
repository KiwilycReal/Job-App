import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UploadPersonInfoPage } from './upload-person-info.page';

const routes: Routes = [
  {
    path: '',
    component: UploadPersonInfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UploadPersonInfoPage]
})
export class UploadPersonInfoPageModule {}
