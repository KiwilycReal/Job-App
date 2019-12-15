import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';
import * as firebase from 'firebase/app'

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit, AfterViewInit {

  private firstInit: boolean;

  constructor(@Inject('loginService') private loginService, private router: Router) {
    this.loginService.fa.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    this.firstInit = true;
  }

  @ViewChild("displayName", {static: true}) displayNameEle: ElementRef;

  tryLogout(){
    this.loginService.userLogout().then(
      res => {
        console.log("success");
        console.log(res);
      }, err => {
        console.log("err");
        console.log(err);
      }
    );
    // this.router.navigate(["login"])
  }

  toLogin(){
    if(this.displayNameEle.nativeElement.innerHTML == "请先登录"){
      this.router.navigate(['login']);
    }else{
      console.log("relax");
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    // console.dir(this.displayNameEle.nativeElement);
    // console.dir(history.state);
    console.log("PI component view ready, cur name is: "+this.loginService.curDisplayName);
    this.displayNameEle.nativeElement.innerHTML = this.loginService.curDisplayName;
    this.loginService.displayNameEle = this.displayNameEle.nativeElement;
    // this.loginService.hello();
    // console.dir(this.loginService);
    // if(this.firstInit){
    //   this.firstInit = false;
    //   this.loginService.displayNameEle = this.displayNameEle.nativeElement;
    // }
    // this.displayNameEle.nativeElement.innerHTML = history.state.hello;
    // this.loginService.userAuthState();
    // this.displayNameEle.nativeElement.innerHTML = this.loginService.curDisplayName;
    // console.dir(this.loginService.testEle);
  }

}
