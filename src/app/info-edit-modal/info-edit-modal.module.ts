import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoEditModalPage } from './info-edit-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [InfoEditModalPage],
  entryComponents: [InfoEditModalPage]
})
export class InfoEditModalPageModule {}
