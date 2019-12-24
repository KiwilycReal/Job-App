import { Injectable, OnDestroy } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnDestroy {

  ngOnDestroy(): void {
    this.unsubscribeAuth();
  }

  unsubscribeAuth: firebase.Unsubscribe;

  // public t: any;
  curAuthState;
  private displayNameElem: HTMLElement = undefined;
  private loginIconElem;
  private curDisplayName = undefined;
  curUser = undefined;
  signOutBtnElem;
  headDetailIconElem;
  private fuck = 0;
  private imgUrl;
  // private myself = this;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  hello(){
    this.fuck += 10;
  }

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  userRegister(data){
    return new Promise<any>((resolve, reject) => {
      this.fa.auth.createUserWithEmailAndPassword(data.email, data.password)
                  .then(res => {
                    resolve(res);
                  }, err => reject(err));
    })
  }

  userLogin(data){
    return new Promise<any>((resolve, reject) => {
      this.fa.auth.signInWithEmailAndPassword(data.email, data.password)
                  .then(res => {
                    resolve(res);
                  }, err => reject(err));
    })
  }

  userAuthState(self){
    self.unsubscribeAuth = this.fa.auth.onAuthStateChanged(
      user => {
        if(user){
          self.curUser = user;
          console.log("Current user is "+user.email+"////"+user.displayName);

        }else{
          console.log("No one is logged in");
        }
      // if(user){
      //   self.signOutBtn = "";
      //   // test.curUser = user;
      //   self.curUser = user;
      //   console.log("Current user is "+user.email+"////"+user.displayName);
      //   if(user.displayName != null) self.curDisplayName = user.displayName;
      //   // console.log(self.loginIconElem);
      //   self.loginIconElem.el.style.display = "none";
      //   self.headDetailIconElem.el.detailIcon = "noen";
      //   self.signOutBtnElem.el.style.display = "";
      //   // console.log(this);
      //   // self.displayNameElem.innerHTML = user.displayName;
      // }else{
      //   self.signOutBtn = "none";
      //   console.log("No one is logged in");
      //   self.curUser = undefined;
      //   self.curDisplayName = "请先登录";
      //   self.loginIconElem.el.style.display = "";
      //   self.headDetailIconElem.el.detailIcon = "arrow-round-forward";
      //   self.signOutBtnElem.el.style.display = "none";
      //   // console.log(this);
      //   // self.displayNameElem.innerHTML = "请先登录";
      // }
      // if(self.displayNameElem){
      //   self.displayNameElem.innerHTML = self.curDisplayName;
      // }
      });
  }

  changeDisplayName(name){
    this.curDisplayName = name;
    if(this.displayNameElem){
      this.displayNameElem.innerHTML = name;
    }
  }

  userLogout(){
    return new Promise<any>((resolve, reject) => {
      this.fa.auth.signOut()
                  .then(res => {
                    resolve(res);
                  }, err => reject(err))
                  .catch(function(error){
                    console.log("Logout error => "+error);
                  })
    })
  }

  // getUser(): Observable<firebase.User>{
  //   return this.curAuthState.
  // }

  constructor(private fs: AngularFirestore, public fa: AngularFireAuth) {
    // this.t = new Object();
    // this.testEle = undefined;
    console.log("Service created!");
    this.userAuthState(this);
    this.fa.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    this.curAuthState = this.fa.authState;
  }
}
