import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';
import * as firebase from 'firebase/app'

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit, AfterViewInit {

  @ViewChild('headDetailIcon', {static: false}) headDetailIconElem
  @ViewChild('signOutBtn', {static: false}) signOutBtnElem

  private firstInit: boolean;

  constructor(@Inject('loginService') private loginService, private router: Router) {
    this.loginService.fa.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    this.firstInit = true;
  }

  @ViewChild("displayName", {static: true}) displayNameElem: ElementRef;

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
    if(this.displayNameElem.nativeElement.innerHTML == "请先登录"){
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
    this.displayNameElem.nativeElement.innerHTML = this.loginService.curDisplayName;
    this.loginService.displayNameElem = this.displayNameElem.nativeElement;
    this.loginService.headDetailIconElem = this.headDetailIconElem;
    this.loginService.signOutBtnElem = this.signOutBtnElem;
  }

}
