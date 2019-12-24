import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';
import * as firebase from 'firebase/app'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit, AfterViewInit {

  // @ViewChild('signOutBtn', {static: false}) signOutBtnElem;
  @ViewChild("displayName", {static: true}) displayNameElem: ElementRef;

  curUser;
  curUserDoc = {
    mobile: "",
    wechat: ""
  }
  isLogged = false;
  email;
  curDisplayName = "请先登录";
  curAvatarUrl = "../../assets/cxk.jpg";

  constructor(@Inject('loginService') private loginService,
              @Inject('commDbService') private commDbService,
              private router: Router) {}


  tryLogout(){
    this.loginService.userLogout().then(
      res => console.log("Log out success"),
      err => console.log("Log out error")
    );
  }

  toLogin(){
    if(this.isLogged){
      console.log("relax");
    }else{
      this.router.navigate(['login']);
    }
  }

  async initialize(){
    var authState: Observable<any> = this.loginService.curAuthState;
    await new Promise((resolve, reject) => {
      //Monitor user authstate changes
      authState.subscribe(
        async value => {
          if(value){
            //If authstate become logged
            this.isLogged = true;
            this.curUser = value;
            this.curDisplayName = value.displayName;
            this.email = value.email;
            await this.commDbService.fetchUserDoc(value.uid).then(
              res => {
                console.log(res.data());
                this.curUserDoc = res.data();
                console.log(this.curUserDoc);
              }
            );
            resolve(value);
          }else{
            this.isLogged = false;
            this.curUser = null;
            this.curDisplayName = "请先登录";
            this.email = "";
            reject(null);
          }
        }
      )
    });
  }

  ngOnInit() {
    this.loginService.fa.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    this.initialize();
  }

  ngAfterViewInit() {
    console.log("PI component view ready, cur name is: "+this.curDisplayName);
    this.loginService.displayNameElem = this.displayNameElem.nativeElement;
  }

}
