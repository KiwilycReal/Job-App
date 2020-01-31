import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchPage } from './search.page';
import { JobDetailPageModule } from '../job-detail/job-detail.module';

import { WorkTypePipe } from '../pipes/work-type.pipe';

const routes: Routes = [
  {
    path: 'search',
    component: SearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    JobDetailPageModule
  ],
  declarations: [SearchPage, WorkTypePipe],
  exports: [WorkTypePipe]
})
export class SearchPageModule {}
