import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Routes, RouterModule } from '@angular/router';

import { MessagePage } from './message.page';
import { ChatComponent } from '../chat/chat.component';
import { ChatModule } from '../chat/chat.module';

const routes: Routes = [
  {
    path: '',
    component: MessagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ChatModule
  ],
  declarations: [MessagePage]
})
export class MessagePageModule {}
