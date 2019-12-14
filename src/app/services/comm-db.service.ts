import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { resolve } from 'url';
import { reject } from 'q';
import * as ResumeInterfaces from '../interfaces/resume-interfaces'
import * as firebase from 'firebase/app'


@Injectable({
  providedIn: 'root'
})
export class CommDbService {

  

  createUserDoc(uid, data){
    return new Promise<any>((resolve, reject) => {
      this.fs.collection("UserInfo").doc(uid).set(data).then(
        res => {resolve(res); console.dir("Create new user info",res)},
        err => reject(err)
      )
    });
  }

  updateUserDoc(uid, data){
    return new Promise<any>((resolve, reject) => {
      this.fs.collection("UserInfo").doc(uid).update(data).then(
        res => {resolve(res); console.log("User doc updated", res)},
        err => reject(err)
      )
    });
  }

  // updateUserDocArray(uid, field, value, isAdd){
  //   if(isAdd){
  //     return new Promise<any>((resolve, reject) => {
  //       this.fs.collection("UserInfo").doc(uid).update({
          
  //       })
  //     })
  //   }else{

  //   }
  // }

  updateUserDocWorkExp(uid, value, isAdd){
    if(isAdd){
      return new Promise<any>((resolve, reject) => {
        this.fs.collection("UserInfo").doc(uid).update({
          workExp: firebase.firestore.FieldValue.arrayUnion(value)
        }).then(
          res => {resolve(res); console.log("Workexp array updated(add)",res);},
          err => reject(err)
        )
      });
    }else{
      return new Promise<any>((resolve, reject) => {
        this.fs.collection("UserInfo").doc(uid).update({
          workExp: firebase.firestore.FieldValue.arrayRemove(value)
        }).then(
          res => {resolve(res); console.log("Workexp array updated(remove)",res);},
          err => reject(err)
        )
      });
    }
  }

  fetchUserDoc(uid){
    return this.fs.collection("UserInfo").doc(uid).snapshotChanges();
  }
  

  constructor(private fs: AngularFirestore) { }
}