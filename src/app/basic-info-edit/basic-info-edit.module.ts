import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BasicInfoEditPage } from './basic-info-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [BasicInfoEditPage],
  entryComponents: [BasicInfoEditPage]
})
export class BasicInfoEditPageModule {}
