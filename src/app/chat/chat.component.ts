import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalController, IonContent, LoadingController } from '@ionic/angular';
import { ImgZoomPage } from '../img-zoom/img-zoom.page'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {

  // Using mutation observer to scroll the content to bottom
  ngAfterViewInit() {
    this.mutatioinObserver = new MutationObserver(mutations => {
      // Dismiss the loading layer when scroll event finished
      this.scrollContainer.scrollToBottom(200).then(res=>this.loadingController.dismiss().catch(err=>console.warn(err)));
    });

    this.mutatioinObserver.observe(this.logList.nativeElement,{
      childList: true
    })
  }

  ngOnDestroy(){
    this.mutatioinObserver.disconnect();
    this.chatListener.unsubscribe();
    // Update current user's last read msg in this chat
    var obj = {}
    obj['chats.'+this.cid] = this.logs[this.logs.length-1].mid;
    this.commDbService.updateUserDoc(this.myUid, obj);
    console.log("chatdestroy");
  }

  @ViewChild('container', {read: IonContent,static: false}) scrollContainer: IonContent;
  @ViewChild('logList', {read: ElementRef,static: false}) logList: ElementRef;

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
  // The flag that determine whether the extra func panel is displayed
  showExtra = false;

  // Mutation observer to handle scroll down event
  mutatioinObserver: MutationObserver;

  takePhotoOptions: CameraOptions = {
    quality: 40,
    destinationType: this.camera.DestinationType.DATA_URL,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    encodingType: this.camera.EncodingType.PNG
  };
  libraryPhotoOptions: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    encodingType: this.camera.EncodingType.PNG
  };
  
  constructor(private modalController: ModalController,
              private loadingController: LoadingController,
              private camera: Camera,
              @Inject('commDbService') public commDbService,
              @Inject('chatService') public chatService) { }

  selfDismiss(){
    this.mutatioinObserver.disconnect();
    this.chatListener.unsubscribe();
    // Update current user's last read msg in this chat
    var obj = {}
    obj['chats.'+this.cid] = this.logs[this.logs.length-1].mid;
    this.commDbService.updateUserDoc(this.myUid, obj);
    this.modalController.dismiss({
      dismissed: true,
      lastMid: this.logs[this.logs.length-1].mid
    });
  }

  showExtraPanel(){
    this.showExtra = !this.showExtra;
    setTimeout(() => {
      this.scrollContainer.scrollToBottom();
    }, 50);
  }

  sendMsg(){
    this.chatService.addMsgToChat(this.cid, this.myUid, this.targetUid, this.msg, false);
    this.msg = null;
  }

  async sendImg(isCamera: boolean){
    var options = isCamera?this.takePhotoOptions:this.libraryPhotoOptions;
    const loading = await this.loadingController.create({
      message: "处理中...",
      duration: 10000
    })
    this.camera.getPicture(options).then(
      async res => {
        await loading.present();
        return this.commDbService.uploadBase64Img('data:image/png;base64,'+res, this.myUid);
      }
    ).then(
      res => {
        return this.chatService.addMsgToChat(this.cid, this.myUid, this.targetUid, "[图片]", true, res);
      }
    ).then(
      res => {
        this.loadingController.dismiss().catch(err=>console.warn(err));
      }
    )

  }

  async zoomImg(){

  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: "载入中...",
      duration: 20000
    });
    await loading.present();
    
    this.chatListener = this.chatService.getChatSnapshotChange(this.cid).subscribe(
      res => {
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
      }
    );
  }

}
