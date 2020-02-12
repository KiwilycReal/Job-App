import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageCropperModule } from 'ngx-image-cropper'

import { BasicInfoEditPage } from './basic-info-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageCropperModule
  ],
  declarations: [BasicInfoEditPage],
  entryComponents: [BasicInfoEditPage]
})
export class BasicInfoEditPageModule {}
