import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  userRegister(data){return new Promise<any>((resolve, reject) => {
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

  userAuthState(){
    this.fa.auth.onAuthStateChanged(function(user) {
      if(user){
        console.log("Current user is "+user.email+"////"+user.displayName);
      }else{
        console.log("No one is logged in");
      }
  });
  }

  

  constructor(private fs: AngularFirestore, public fa: AngularFireAuth) { }
}
