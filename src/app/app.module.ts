import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AngularFireAuthModule } from '@angular/fire/auth';

import { AngularFireStorageModule } from '@angular/fire/storage'

import { LoginService } from './services/login.service'
import { CommDbService } from './services/comm-db.service';
import { SearchPageModule } from './search/search.module';
import { FavJobsPageModule } from './fav-jobs/fav-jobs.module';
import { ChatService } from './services/chat.service';
import { ShareDataService } from './services/share-data.service';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot({animated: false}), AppRoutingModule,
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AngularFirestoreModule,
  AngularFireAuthModule,
  AngularFireStorageModule,
  SearchPageModule,
  FavJobsPageModule],
  providers: [
    StatusBar,
    InAppBrowser,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: 'loginService', useClass: LoginService },
    { provide: 'commDbService', useClass: CommDbService },
    { provide: 'chatService', useClass: ChatService },
    { provide: 'shareDataService', useClass: ShareDataService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
