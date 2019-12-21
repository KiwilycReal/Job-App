import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { JobDetailPage } from './job-detail/job-detail.page';
import { SearchPageModule } from './search/search.module'

const routes: Routes = [
  { path: '', redirectTo: 'front-page', pathMatch: 'full' },
  { path: 'front-page', loadChildren: './front-page/front-page.module#FrontPagePageModule' },
  // { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  // { path: 'search', loadChildren: () => SearchPageModule },
  { path: 'personal-info', loadChildren: './personal-info/personal-info.module#PersonalInfoModule' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'message', loadChildren: './message/message.module#MessagePageModule'},
  // { path: 'upload-person-info', loadChildren: './upload-person-info/upload-person-info.module#UploadPersonInfoPageModule'},
  {
    path: 'upload-person-info',
    loadChildren: () => import('./upload-person-info/upload-person-info.module').then( m => m.UploadPersonInfoPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'fav-jobs',
    loadChildren: () => import('./fav-jobs/fav-jobs.module').then( m => m.FavJobsPageModule),
    data: {msg:"favourite"}
  },
  {
    path: 'history-jobs',
    loadChildren: () => import('./fav-jobs/fav-jobs.module').then( m => m.FavJobsPageModule),
    data: {msg:"history"}
  },
  // { path: 'search/:id', loadChildren: './job-detail/job-detail.module#JobDetailPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
