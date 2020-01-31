import { Component, OnInit, Inject, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  ngAfterViewChecked(){
    this.scrollToBottom();
  }
  ngOnDestroy(){
    this.chatListener.unsubscribe();
    // Update current user's last read msg in this chat
    var obj = {}
    obj['chats.'+this.cid] = this.logs[this.logs.length-1].mid;
    this.commDbService.updateUserDoc(this.myUid, obj);
    console.log("chatdestroy");
  }

  @ViewChild('container', {static: false}) private scrollContainer: IonContent;

  /* Will be automatically initialized by the parent page
  when this modal showing */
  myUid;
  myAvatarUrl;
  targetUid;
  targetName = "Loading";
  targetAvatarUrl;
  cid;
  // The variable bound to user's input
  msg;
  // The listener of the current chat
  chatListener;

  // The array that store all the logs of the current chat
  logs = [];
  
  constructor(private modalController: ModalController,
              @Inject('commDbService') public commDbService,
              @Inject('chatService') public chatService) { }

  async selfDismiss(){
    // this.chatListener
    this.modalController.dismiss({
      dismissed: true,
      lastMid: this.logs[this.logs.length-1].mid
    })
  }

  // loadData(ev){
  //   setTimeout(() => {
  //     if(this.logs.length == 5){
  //       ev.target.disabled = true;
  //       return;
  //     }
  //     ev.target.complete();
  //     this.logs.push(this.log);

  //   }, 1000);
  // }

  async sendMsg(){
    this.chatService.addMsgToChat(this.cid, this.myUid, this.targetUid, this.msg);
    this.msg = null;
    await this.scrollContainer.scrollToBottom(400);
  }

  scrollToBottom(){
    try{
      return this.scrollContainer.scrollToBottom(400);
      // console.log(this.scrollContainer)
    }catch(err){console.log("Found err:",err)};
  }

  ngOnInit() {
    console.log(this.myUid);
    this.chatListener = this.chatService.getChatSnapshotChange(this.cid).subscribe(res => {
      var tempLogs = [];
      res.reverse().forEach(
        elem => {
          var tempObj = elem.payload.doc.data({serverTimestamps: 'estimate'});
          tempObj["mid"] = elem.payload.doc.id;
          tempObj["timestamp"] = tempObj["timestamp"].toDate().toLocaleString();
          tempLogs.push(tempObj);
        }
      );
      this.logs = tempLogs;
      console.log(this.logs);
    });
  }

}
