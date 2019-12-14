import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { JobDetailPage } from './job-detail/job-detail.page';

const routes: Routes = [
  { path: '', redirectTo: 'front-page', pathMatch: 'full' },
  { path: 'front-page', loadChildren: './front-page/front-page.module#FrontPagePageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
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
  // { path: 'search/:id', loadChildren: './job-detail/job-detail.module#JobDetailPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
