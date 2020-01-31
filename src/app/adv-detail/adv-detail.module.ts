import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvDetailPage } from './adv-detail.page';
import { AgmCoreModule } from '@agm/core'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDQMF27P4q4jc5IE0c40XvJ_4e5yj2f3h0'
    })
  ],
  declarations: [AdvDetailPage],
  entryComponents: [AdvDetailPage]
})
export class AdvDetailPageModule {}
