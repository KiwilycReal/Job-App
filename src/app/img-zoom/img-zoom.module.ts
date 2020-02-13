import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

// import { ImgZoomPageRoutingModule } from './img-zoom-routing.module';

import { ImgZoomPage } from './img-zoom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // ImgZoomPageRoutingModule
  ],
  declarations: [ImgZoomPage],
  entryComponents: [ImgZoomPage]
})
export class ImgZoomPageModule {}
