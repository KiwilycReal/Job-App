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

  async createHelperChat(uid){
    var newChatDoc  = {
      users: [uid, "猫耳朵"]
    }
    var faqs = [];
    await this.fetchFAQs().then(
      res => {
        res.docs.forEach(
          doc => {
            faqs.push({q: doc.id, i: doc.data().index});
          }
        );
      }
    ).then(
      res => {
        return this.afs.collection("Chats").add(newChatDoc)
      }
    ).then(
      res => {
        var obj = {};
        obj["chats."+res.id] = "";
        this.afs.collection("UserInfo").doc(uid).update(obj);
        return res.id;
      },
      err => {
        console.log("Failed to create the new chat");
      }
    ).then(
      res => {
        this.addMsgToChat(res, "猫耳朵", uid, "终于等到你，这是小耳朵给你发的第一条信息<br>请回复相关序号来获取对应问题的答案", false);
        var faqMsg = "";
        faqs.forEach(
          faq => {
            faqMsg += faq.i + ". " + faq.q + "<br>";
          }
        )
        this.addMsgToChat(res, "猫耳朵", uid, faqMsg, false);
      }
    )
  }

  fetchFAQs(){
    return this.afs.collection("FAQs", ref=>{return ref.orderBy("index", "asc")}).get().toPromise();
  }

  testGet(){
    var d = new Date(1579456848000);
    return this.afs.collection("Chats").doc("enDYDznpeVbfdPWjfcmB").collection("Logs", ref => {
      return ref.orderBy('timestamp', 'asc').startAfter(d);
    }).get().toPromise();
  }

  addMsgToChat(cid, uidFrom, uidTo, msg, hasImg, imgUrl=null){
    var msgObj = {
      from: uidFrom,
      to: uidTo,
      msg: msg,
      hasImg: hasImg,
      imgUrl: imgUrl
    };

    return this.afs.collection("Chats").doc(cid).collection("Logs").add(msgObj).then(
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
