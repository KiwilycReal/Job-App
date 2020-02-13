import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ImgZoomPageModule } from '../img-zoom/img-zoom.module'



@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ImgZoomPageModule
  ],
  entryComponents: [ChatComponent]
})
export class ChatModule { }
