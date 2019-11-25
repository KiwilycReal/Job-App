import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PersonalInfoComponent } from './personal-info.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalInfoComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PersonalInfoComponent]
})
export class PersonalInfoModule { }
