import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app'
import { resolve } from 'url';


@Injectable({
  providedIn: 'root'
})
export class CommDbService {
  
  constructor(private fs: AngularFirestore) { }
  
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

  /**
   * Can optimize the fucntion logic to allow 
   * multiple fiedls updates in one function call
   */
  updateUserDocArray(uid: string, field, value, isAdd: boolean){
    var updateObj = {};
    if(isAdd){
      updateObj[field] = firebase.firestore.FieldValue.arrayUnion(value)
    }else{
      updateObj[field] = firebase.firestore.FieldValue.arrayRemove(value)
    }
    return new Promise<any>((resolve, reject) => {
      this.fs.collection("UserInfo").doc(uid).update(updateObj).then(
        res => {resolve(res); console.log("User ",uid,field," update success")},
        err => {reject(err); console.log("User",uid,field," update failed")}
      );
    });
  }

  fetchUserDoc(uid){
    return this.fs.collection("UserInfo").doc(uid).get().toPromise();
  }

  fetchFavJobList(jids: string[]){
    var jobCollection = this.fs.firestore.collection("Jobs");
    return this.fs.firestore.runTransaction(
      transaction => {
        return new Promise<any>((resolve, reject) => {
          var tempList = [];
          jids.forEach(
            value => {
              transaction.get(jobCollection.doc(value)).then(
                res => {
                  tempList.push(res.data());
                }
              )
            }
          );
          return resolve(tempList);
        });
      });
  }

}