import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private afs: AngularFirestore) {}

  async getAvailableUsers(talkedUsers: string[]){
    return await this.afs.collection("UserInfo").get().toPromise().then(
      res => {
        return res.docs.filter(userDoc => !talkedUsers.includes(userDoc.id)).map(
          userDoc => {
            var detailedDoc = userDoc.data();
            return {uid: userDoc.id, username: detailedDoc.title+""+detailedDoc.firstName+" "+detailedDoc.lastName};
          }
        );
      },
      err => console.log("Failed get available users", err)
    );
  }

  async createChat(uid1, uid2){
    var newChatDoc = {
      users: [uid1, uid2]
    }

    /* When the new chat doc is successfully created, add the
    chat id to corresponding users' userinfo doc*/
    await this.afs.collection("Chats").add(newChatDoc).then(
      res => {
        var obj = {};
        obj["chats."+res.id] = "";
        obj["talked"] = firebase.firestore.FieldValue.arrayUnion(uid2);
        this.afs.collection("UserInfo").doc(uid1).update(obj);
        obj["talked"] = firebase.firestore.FieldValue.arrayUnion(uid1);
        this.afs.collection("UserInfo").doc(uid2).update(obj);
      },
      err => {
        console.log("Failed to create the new chat");
      }
    );
  }

  testGet(){
    var d = new Date(1579456848000);
    return this.afs.collection("Chats").doc("enDYDznpeVbfdPWjfcmB").collection("Logs", ref => {
      return ref.orderBy('timestamp', 'asc').startAfter(d);
    }).get().toPromise();
  }

  addMsgToChat(cid, uidFrom, uidTo, msg){
    return this.afs.collection("Chats").doc(cid).collection("Logs").add({
      from: uidFrom,
      to: uidTo,
      msg: msg
    }).then(
      res => {
        res.update({
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
      }
    );
  }

  fetchChat(cid){
    return this.afs.collection("Chats").doc(cid).get().toPromise();
  }

  getChatSnapshotChange(cid){
    return this.afs.collection("Chats").doc(cid).collection("Logs", ref => {
      return ref.orderBy("timestamp", "desc");
    }).snapshotChanges();
  }

  getCurUserChatsSnapshotChange(uid){
    return this.afs.collection("UserInfo").doc(uid).snapshotChanges();
  }
}
