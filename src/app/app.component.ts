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
export class AppComponent {
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

  // ngAfterViewInit(): void {
  //   console.log(this.t);
  //   //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //   //Add 'implements AfterViewInit' to the class.
    
  // }
  // test(){
  //   // console.log(this.LoginService.testEle);
  //   this.LoginService.testEle.innerHTML = "hahahahah";
  // }
}
