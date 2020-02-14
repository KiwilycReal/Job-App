import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecommendPageRoutingModule } from './recommend-routing.module';

import { RecommendPage } from './recommend.page';
import { AdvDetailPageModule } from '../adv-detail/adv-detail.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecommendPageRoutingModule,
    AdvDetailPageModule
  ],
  declarations: [RecommendPage]
})
export class RecommendPageModule {}
