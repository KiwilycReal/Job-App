import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecommendPageRoutingModule } from './recommend-routing.module';

import { RecommendPage } from './recommend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecommendPageRoutingModule
  ],
  declarations: [RecommendPage]
})
export class RecommendPageModule {}
