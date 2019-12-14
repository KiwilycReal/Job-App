import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgmCoreModule } from '@agm/core'

import { JobDetailPage } from './job-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDQMF27P4q4jc5IE0c40XvJ_4e5yj2f3h0'
    })
  ],
  declarations: [JobDetailPage],
  entryComponents: [JobDetailPage]
})
export class JobDetailPageModule {}
