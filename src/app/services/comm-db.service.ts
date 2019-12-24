import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage'
import * as firebase from 'firebase/app'
import { FormControl, FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class CommDbService {
  
  constructor(private afs: AngularFirestore,
              private afstorage: AngularFireStorage) {}

  newJobForm = new FormGroup({
    imageUrl: new FormControl(''),
    title: new FormControl(''),
    salary: new FormControl(''),
    introText: new FormControl(''),
    details: new FormControl(''),
    position: new FormControl(''),
    publishDateTime: new FormControl(''),
    lastEditDateTime: new FormControl(''),
    geolocation: new FormControl('')
  });

  createJob(data){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("Jobs").add(data).then(
        res => resolve(res),
        err => reject(err)
      )
    });
  }

  fetchJobList(){
    return this.afs.collection('Jobs').get().toPromise();
  }

  fetchPartialJobList(jids: string[]){
    var jobCollection = this.afs.firestore.collection("Jobs");
    return this.afs.firestore.runTransaction(
      transaction => {
        return new Promise<any>((resolve, reject) => {
          var tempList = [];
          var temp;
          jids.forEach(
            value => {
              transaction.get(jobCollection.doc(value)).then(
                res => {
                  temp = res.data();
                  temp["jid"] = value;
                  tempList.push(temp);
                }
              )
            }
          );
          return resolve(tempList);
        });
      });
  }

  fetchJobsByPay(range){
    return this.afs.collection('Jobs', ref => {
      return ref.where("salary", ">=", range.lower)
                .where("salary", "<=", range.upper)
                .orderBy("salary", "desc");
    }).get().toPromise();
  }
  
  createUserDoc(uid, data){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("UserInfo").doc(uid).set(data).then(
        res => {resolve(res); console.dir("Create new user info",res)},
        err => reject(err)
      )
    });
  }

  updateUserDoc(uid, data){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("UserInfo").doc(uid).update(data).then(
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
      this.afs.collection("UserInfo").doc(uid).update(updateObj).then(
        res => {resolve(res); console.log("User ",uid,field," update success")},
        err => {reject(err); console.log("User",uid,field," update failed")}
      );
    });
  }

  fetchUserDoc(uid){
    return this.afs.collection("UserInfo").doc(uid).get().toPromise();
  }

  async uploadFile(file: any, uid: string){
    var ref = this.afstorage.storage.ref("/").child(uid).child(file.name);
    var task = ref.put(file).then(
      res => console.log(res)
    );
  }

  async listFiles(uid: string){
    var filePaths = [];
    var ref = this.afstorage.storage.ref(uid);
    await ref.listAll().then(
      res => {
        res.items.forEach(
          item => {
            filePaths.push(item.name);
          }
        );
      }
    ).catch(
      err => console.log("Error when fetch file list",err)
    );
    return filePaths;
  }

}