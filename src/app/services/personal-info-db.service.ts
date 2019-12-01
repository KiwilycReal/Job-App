import { Injectable } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PersonalInfoDbService {

  constructor(private fs: AngularFirestore) { }

  createUserInfo(data){
    return new Promise<any>((resolve, reject) => {
      this.fs
          .collection("secondCollection")
          .add(data)
          .then(res => {}, err => reject(err));
    })
  }

  updateUserInfo(data){

  }

  getUserInfo(uid){

  }

  
  
}
