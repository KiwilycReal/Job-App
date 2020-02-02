import { Injectable, OnDestroy } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnDestroy {

  ngOnDestroy(): void {
    this.unsubscribeAuth();
  }

  unsubscribeAuth: firebase.Unsubscribe;

  private userSource = new BehaviorSubject(null);
  currentUser = this.userSource.asObservable();

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
        console.log("login.service got current user:", user);
        if(user){
          self.curUser = user;
          this.userSource.next(user);
        }else{
          this.userSource.next(user);
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
    return this.fa.auth.signOut()
  }
  constructor(private fs: AngularFirestore, public fa: AngularFireAuth) {
    this.userAuthState(this);
    this.fa.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    this.curAuthState = this.fa.authState;
  }
}
