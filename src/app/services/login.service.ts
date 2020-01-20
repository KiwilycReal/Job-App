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

  curAuthState;
  private displayNameElem: HTMLElement = undefined;
  private loginIconElem;
  private curDisplayName = undefined;
  curUser = undefined;
  signOutBtnElem;
  headDetailIconElem;
  private imgUrl;

  loginForm = new FormGroup({
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

  // Bind a observer to monitor user auth state change
  userAuthState(self){
    self.unsubscribeAuth = this.fa.auth.onAuthStateChanged(
      user => {
        if(user){
          self.curUser = user;
          console.log("Current user is "+user.email+"////"+user.displayName);

        }else{
          console.log("No one is logged in");
        }
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
      this.fa.auth.signOut().then(
        res => {
          console.log("Logout success", res);
          resolve(res);
        },
        err => {
          console.log("Logout error", err);
          reject(err);
        }
      )
    })
  }
  constructor(private fs: AngularFirestore, public fa: AngularFireAuth) {
    console.log("Service created!");
    this.userAuthState(this);
    this.fa.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    this.curAuthState = this.fa.authState;
  }
}
