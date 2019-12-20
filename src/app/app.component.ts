import { Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { PersonalInfoComponent } from './personal-info/personal-info.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements AfterViewInit{
  // ngAfterViewInit(): void {
  //   console.log("From root: ",this.testt);
  // }
  t;
  // @ViewChild(PersonalInfoComponent, {read: ElementRef, static: true}) private testEleRef: ElementRef;
  // @ViewChild('t') testt;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    @Inject('loginService') private LoginService
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

  @ViewChild("loginIcon", {static: true}) loginIconElem;

  ngAfterViewInit() {
    // console.log(this.loginIconEle);
    this.LoginService.loginIconElem = this.loginIconElem;
  }
}
