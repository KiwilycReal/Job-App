import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatComponent } from '../chat/chat.component';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit, OnDestroy {
  ngOnDestroy() {
    this.cleanUp();
    console.log("Message page destroyed");
  }

  authSubscription;
  curUser;
  curSegment;
  // A listener that monitoring the list of current user's chats
  chatListListener;
  
  // Contains info of all current user's chats
  chats = {};

  chatListeners = [];

  // Users that can start a chat
  userList = [];

  constructor(private modalController: ModalController,
              @Inject('chatService') public chatService,
              @Inject('loginService') public loginService,
              @Inject('commDbService') public commDbService,
              @Inject('shareDataService') public shareDataService,
              private router: Router) { }

  async showChatModal(chatID, chatDoc){
    const modal = await this.modalController.create({
      component: ChatComponent,
      componentProps: {
        myUid: this.curUser.uid,
        myAvatarUrl: this.curUser.photoURL,
        targetUid: chatDoc.targetUid,
        targetName: chatDoc.targetName,
        targetAvatarUrl: chatDoc.targetAvatarUrl,
        cid: chatID,
        isHelper: chatDoc.targetUid=="猫耳朵"
      }
    });
    // Detach this chat's listener in message page, reopen it at the chat page
    // this.chatListeners[listenerIndex].unsubscribe();
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // Update current chat's unread msg count
    this.chats[chatID].unreadCount = 0;
    this.chats[chatID].lastReadMsg = data.lastMid;
    this.shareDataService.changeUnreadMsgCount(this.calculateTotalUnreadMsgCount());
  }

  // testSegment(event: any){
  //   this.curSegment = event.detail.value;
  // }

  startNewChat(uid){
    this.chatService.createChat(this.curUser.uid, uid);
  }

  calculateTotalUnreadMsgCount(){
    return Object.values(this.chats).map(
      (chat: any) => {
        return chat.unreadCount;
      }
    ).reduce((p,c)=>{return p+c});
  }

  createChatListener(cid) {
    // Used for detach specific listener
    this.chats[cid].listenerIndex = this.chatListeners.push(this.chatService.getChatSnapshotChange(cid).subscribe(async res => {
      // Return if theres no chat logs
      if(!res[0]) return;
      // Calculate current the number of unread msgs
      var msgList = res.map(
        elem => {
          return elem.payload.doc.id
        }
      );
      var lastReadMsg = this.chats[cid].lastReadMsg
      // This clause is to handle when this user has a new chat
      if(lastReadMsg == ""){
        this.chats[cid].unreadCount = msgList.length;
      }else{
        this.chats[cid].unreadCount = msgList.indexOf(lastReadMsg);
      }
      this.shareDataService.changeUnreadMsgCount(this.calculateTotalUnreadMsgCount());
      // Get the other user's username if thhe chat is not from helper
      // await new Promise((resolve, reject) => {
      //   // First fetch the chat document to get the other user's uid
      //   this.chatService.fetchChat(cid).then(
      //     res => {
      //       var users = res.data().users;
      //       console.log(users);
      //       if(users[0]==this.curUser.uid) resolve(users[1]);
      //       resolve(users[0]);
      //     },
      //     err => {
      //       console.log(err);
      //     }
      // // After get the uid, query the db and get the username
      // )}).then(
      //   res => {
      //     this.chats[cid].targetUid = res;
      //     console.log(res);
      //     return this.commDbService.fetchUserDoc(res).then(
      //       res => {
      //         var userDoc = res.data();
      //         console.log(userDoc);
      //         return userDoc.title+userDoc.firstName+" "+userDoc.lastName;
      //       }
      //     );
      //   }
      // // Set the target username of the chat
      // ).then(
      //   res => this.chats[cid].targetName = res
      // );
      var latestMsgObj = res[0].payload.doc.data({serverTimestamps: 'estimate'});
      try{
        // var dateObj = latestMsgObj.timestamp.toDate();
        // this.chats[cid].latestTime = dateObj.toLocaleString();
        this.chats[cid].latestTime = latestMsgObj.timestamp.toDate();
        var tempStr = latestMsgObj.msg.slice(0,6);
        if(latestMsgObj.msg.length > 13) tempStr += "...";
        this.chats[cid].latestMsg = tempStr;
        // In case of the other user changed their avatar or display name
        // this.chats[cid].avatar = "https://gravatar.com/avatar";
        console.log(this.chats);
      }catch(error){
        console.log(error, latestMsgObj);
      }
    })) - 1;
  }
  
  testFunc(ev?){
    console.log(ev)
    // this.chatService.addMsgToChat("", "u1", "u2", "yes");
    // var today = new Date(1579417500);
    // this.chatService.testGet().then(res => console.log(res))
    // this.chatService.addMsgToChat("2ROZRp2EWHoQRjLMkcdu", "qzCl0Fbl2dchVQ5w0jB5C495Akn2", "Q5is5e4mkXPcl8VbLr15VsZ87uj1", "this is test msg1");
  }

  async initialize(){
    // Set user authstate subscription
    var authState: Observable<any> = this.loginService.curAuthState;
    await new Promise((resolve, reject) => {
      if(this.authSubscription) return "Auth subscription existed";
      this.authSubscription = authState.subscribe(
        value => {
          if(value){
            console.log("Im back");
            this.curUser = value;
            // Start monitoring user's alive chats
            if(!this.chatListListener){
              this.chatListListener = this.chatService.getCurUserChatsSnapshotChange(value.uid).subscribe(async res => {
                var result = res.payload.data();
                var talkedUsers = [value.uid];
                await this.chatService.getAvailableUsers(talkedUsers.concat(result.talked)).then(res => {this.userList = res;console.log(this.userList)});
                var chatList = result.chats;
                if(!chatList) return;
                var tempChats = this.chats;
                var self = this;
                Object.keys(chatList).forEach(
                  cid => {
                    if(!tempChats[cid]){
                      tempChats[cid] = {
                        latestTime: null,
                        latestMsg: "Click to start chat...",
                        targetAvatarUrl: "../assets/icon/user.svg",
                        targetName: null,
                        targetUid: null,
                        lastReadMsg: chatList[cid],
                        extraTag: "A Tag",
                        unreadCount: 0
                      };
                      self.createChatListener(cid);
                      // When created a new chat, update its corresponding values
                      // Update targetUid
                      this.chatService.fetchChat(cid).then(
                        res => {
                          var users = res.data().users;
                          var targetUid = "";
                          if(users[0]==this.curUser.uid){
                            targetUid = users[1];
                          }else{
                            targetUid = users[0];
                          }
                          tempChats[cid]["targetUid"] = targetUid;
                          return targetUid;
                        },
                        err => console.log("Fetch chat error", err)
                      ).then(
                        // Fetch target user info
                        res => {
                          if(res=="猫耳朵") return {helper: "helper"}
                          return this.commDbService.fetchUserDoc(res);
                        }
                      ).then(
                        // Update targetName
                        res => {
                          if(!res.data){
                            tempChats[cid]["targetName"] = "猫耳朵小助手";
                            tempChats[cid]["targetAvatarUrl"] = "../../assets/wechat.png";
                            return null;
                          }
                          var userDoc = res.data();
                          tempChats[cid]["targetName"] = userDoc.displayName;
                          tempChats[cid]["targetAvatarUrl"] = userDoc.avatarUrl;
                        },
                        err => console.log("Fetch user doc error", err)
                      );
                    }
                  }
                );
                this.chats = tempChats;
              });
            }
            console.log(this.curUser);
            resolve(value);
          }else{
            this.cleanUp();
            reject(value);
          }
        });
    }).catch(
      err => this.router.navigate(['/login'])
    )
  }

  cleanUp(){
    // Detach all listeners
    if(this.chatListListener) this.chatListListener.unsubscribe();
    this.chatListListener = null;
    this.chatListeners.forEach(
      l => {
        l.unsubscribe();
      }
    );
    this.chatListeners = [];
    // Clear chat list
    this.chats = {};
  }

  ngOnInit() {
    this.initialize();
  }

}
