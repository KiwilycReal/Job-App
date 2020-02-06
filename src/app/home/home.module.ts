import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { NgCircleProgressModule } from 'ng-circle-progress';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// import { AdvDetailPageModule } from '../adv-detail/adv-detail.module';

import { JobDetailPageModule } from '../job-detail/job-detail.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobDetailPageModule,
    // AdvDetailPageModule,
    // InAppBrowser,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    NgCircleProgressModule.forRoot({
    radius: 100,
    outerStrokeWidth: 16,
    innerStrokeWidth: 8,
    outerStrokeColor: '#78C000',
    innerStrokeColor: '#C7E596',
    animationDuration: 300
  })
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
