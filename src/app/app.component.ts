import { Component, OnInit, Inject } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{
  
  unreadMsgCountSubscription;
  unreadMsgCount;

  currentUserSubscription;
  isLogged;
  curUser;

  constructor(
    @Inject('shareDataService') public shareDataService,
    @Inject('loginService') public loginService,
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
    this.currentUserSubscription = this.loginService.currentUser.subscribe(
      user => {
        this.curUser = user;
        console.log("app.component got current user:", this.curUser);
        if(user){
          this.isLogged = true;
          this.shareDataService.changeUserMetadata({
            displayName: user.displayName,
            avatarUrl: user.photoURL
          });
        }else{
          this.isLogged = false;
          this.shareDataService.changeUserMetadata({
            displayName: "请先登录",
            avatarUrl: "../assets/icon/user.svg"
          });
        }
      }
    );
    this.unreadMsgCountSubscription = this.shareDataService.currentUnreadMsgCount.subscribe(
      msgCount => {
        console.log("app.component got current unread msg count:", msgCount);
        this.unreadMsgCount = msgCount;
      }
    );
  }
}
