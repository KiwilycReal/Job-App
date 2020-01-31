import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  entryComponents: [ChatComponent]
})
export class ChatModule { }
