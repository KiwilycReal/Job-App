import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UploadPersonInfoPage } from './upload-person-info.page';
import { InfoEditModalPageModule } from '../info-edit-modal/info-edit-modal.module';
import { ResumePipe } from '../pipes/resume.pipe';

import { NgCircleProgressModule } from 'ng-circle-progress'
import { BasicInfoEditPageModule } from '../basic-info-edit/basic-info-edit.module';

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
    InfoEditModalPageModule,
    BasicInfoEditPageModule,
    NgCircleProgressModule.forRoot({
      radius: 30,
      outerStrokeWidth: 7,
      innerStrokeWidth: 0,
      outerStrokeColor: "#AAAAAA",
      animation: true,
      animationDuration: 300,
      showImage: true,
      imageHeight: 40,
      imageWidth: 40
    })
  ],
  declarations: [UploadPersonInfoPage, ResumePipe]
})
export class UploadPersonInfoPageModule {}
