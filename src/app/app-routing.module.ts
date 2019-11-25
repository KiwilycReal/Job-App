import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'front-page', pathMatch: 'full' },
  { path: 'front-page', loadChildren: './front-page/front-page.module#FrontPagePageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'personal-info', loadChildren: './personal-info/personal-info.module#PersonalInfoModule' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
