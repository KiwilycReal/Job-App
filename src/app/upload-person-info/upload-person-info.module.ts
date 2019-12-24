import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UploadPersonInfoPage } from './upload-person-info.page';
import { InfoEditModalPageModule } from '../info-edit-modal/info-edit-modal.module';
import { ResumePipe } from '../pipes/resume.pipe';

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
    RouterModule.forChild(routes),
    InfoEditModalPageModule
  ],
  declarations: [UploadPersonInfoPage, ResumePipe]
})
export class UploadPersonInfoPageModule {}
