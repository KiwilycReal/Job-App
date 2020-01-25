import { Component, OnInit, Inject } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { PersonalInfoComponent } from './personal-info/personal-info.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{
  
  unreadMsgCountSubscription;
  unreadMsgCount;

  constructor(
    @Inject('shareDataService') public shareDataService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    // @Inject('loginService') private LoginService
  ) {
    this.initializeApp();
    // this.LoginService.userAuthState();
    // console.dir(this.LoginService);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  
  ngOnInit() {
    this.unreadMsgCountSubscription = this.shareDataService.currentUnreadMsgCount.subscribe(
      msg => {
        console.log(msg);
        this.unreadMsgCount = msg;
      }
    )
  }
}
