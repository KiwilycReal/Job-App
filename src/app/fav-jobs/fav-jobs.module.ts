import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavJobsPage } from './fav-jobs.page';
import { Routes, RouterModule } from '@angular/router';
import { JobDetailPageModule } from '../job-detail/job-detail.module';
import { SearchPageModule } from '../search/search.module';

const routes: Routes = [
  {
    path: '',
    component: FavJobsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    IonicModule,
    JobDetailPageModule,
    SearchPageModule
  ],
  declarations: [FavJobsPage]
})
export class FavJobsPageModule {}
