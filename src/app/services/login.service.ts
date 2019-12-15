import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app'

import { promise } from 'protractor';
import { analytics } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // public t: any;
  private displayNameEle: HTMLElement = undefined;
  private loginIconEle;
  private curDisplayName = undefined;
  private curUser = undefined;
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
    this.fa.auth.onAuthStateChanged(function(user) {
      // console.log(this);
      if(user){
        // test.curUser = user;
        self.curUser = user;
        console.log("Current user is "+user.email+"////"+user.displayName);
        if(user.displayName != null) self.curDisplayName = user.displayName;
        // console.log(self.loginIconEle);
        self.loginIconEle.el.style.display = "none";
        // console.log(this);
        // self.displayNameEle.innerHTML = user.displayName;
      }else{
        console.log("No one is logged in");
        self.curDisplayName = "请先登录";
        self.loginIconEle.el.style.display = "";
        // console.log(this);
        // self.displayNameEle.innerHTML = "请先登录";
      }
      if(self.displayNameEle){
        self.displayNameEle.innerHTML = self.curDisplayName;
      }
    });
  }

  changeDisplayName(name){
    if(this.displayNameEle){
      this.displayNameEle.innerHTML = name;
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

  constructor(private fs: AngularFirestore, public fa: AngularFireAuth) {
    // this.t = new Object();
    // this.testEle = undefined;
    console.log("Service created!");
    this.userAuthState(this);
    this.fa.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
  }
}
