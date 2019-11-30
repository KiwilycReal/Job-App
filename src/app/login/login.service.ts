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
  private curDisplayName = undefined;
  private curUser = undefined;
  private fuck = 0;
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
                    res.user.updateProfile({
                      displayName: res.user.email,
                      photoURL: "http://i0.hdslb.com/bfs/archive/1ebcd228cec3f5104031fa9a9f8d113ccbd082db.jpg"
                    }).then(function(){
                      console.log("Update success");
                    }).catch(function(error){
                      console.log(error);
                    });
                    console.log("Default display name set");
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
        self.curDisplayName = user.displayName;
        // console.log(this);
        // self.displayNameEle.innerHTML = user.displayName;
      }else{
        console.log("No one is logged in");
        self.curDisplayName = "请先登录";
        // console.log(this);
        // self.displayNameEle.innerHTML = "请先登录";
      }
      if(self.displayNameEle){
        self.displayNameEle.innerHTML = self.curDisplayName;
      }
    });
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
