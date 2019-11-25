import { Injectable } from '@angular/core';

import { FormControl, FormGroup } from "@angular/forms";

import { AngularFirestore } from '@angular/fire/firestore';
import { resolve } from 'q';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SecondService {

  constructor(private fs:AngularFirestore, public auth: AngularFireAuth) { }

  form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    completed: new FormControl(false)
  })

  createDoc(data){
    return new Promise<any>((resolve, reject) => {
      this.fs
          .collection("secondCollection")
          .add(data)
          .then(res => {}, err => reject(err));
    })
  }

  register(data){
    return new Promise<any>((resolve, reject) => {
      this.auth.auth.createUserWithEmailAndPassword(data.username, data.password)
               .then(res => {
                 resolve(res);
               }, err => reject(err))
    })
  }

  tt(){
    this.auth.auth.onAuthStateChanged(function(user) {
      
        console.log(user);
    });
  }
}
