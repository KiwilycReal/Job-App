import { Component, OnInit, Inject } from '@angular/core';
import { ModalController, LoadingController, IonSlides } from '@ionic/angular';
import { InfoEditModalPage } from '../info-edit-modal/info-edit-modal.page'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BasicInfoEditPage } from '../basic-info-edit/basic-info-edit.page';

@Component({
  selector: 'app-upload-person-info',
  templateUrl: './upload-person-info.page.html',
  styleUrls: ['./upload-person-info.page.scss'],
})
export class UploadPersonInfoPage implements OnInit {
  // Subscription of the current logged user and its meta data
  currentUserSubscription;
  currentUserMetaDataSubscription;

  sliderOpts = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
    speed: 1000,
  };
  
  email;
  curUser;
  curDisplayName;
  curAvatarUrl;
  //Empty object to prevent console error log
  curUserDoc = {
    skills : [],
    workExps : [],
    eduExps : [],
    projExps : [],
    honors : [],
    files : [],
    description : []
  };

  pValue;
  pValueStr;
  pColor;


  title;
  name = 'CXK';
  phone = '123456789';
  
  links = [
    {name: "技能",
     type: "skills",},
    {name: "工作经验",
     type: "workExps"},
    {name: "教育经历",
     type: "eduExps"},
    {name: "项目经验",
     type: "projExps"},
    {name: "个人荣誉",
     type: "honors"},
    {name: "附件",
     type: "files"},
    {name: "个人简介",
     type: "description"},
  ];

  constructor(@Inject('commDbService') public commDbService,
              @Inject('loginService') public loginService,
              @Inject('shareDataService') public shareDataService,
              public modalController: ModalController,
              public loadingController: LoadingController,
              public router: Router) {}

  async presentBasicInfoEditModal(){
    if(!this.curUser){
      console.log("Please login first to edit personal info");
      return;
    }
    const modal = await this.modalController.create({
      component: BasicInfoEditPage,
      componentProps: {
        curUserDoc: this.curUserDoc,
        curUser: this.curUser
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.shareDataService.changeUserMetadata({
      displayName: data.displayName,
      avatarUrl: data.avatarUrl
    });
    await this.commDbService.fetchUserDoc(this.curUser.uid).then(
      res => {
        this.curUserDoc = res.data();
        this.setProgressBar();
      }
    );
  }

  async presentInfoEditModal(link){
    if(!this.curUser){
      console.log("Please login first to edit resume info");
      return;
    }
    const modal = await this.modalController.create({
      component: InfoEditModalPage,
      componentProps: {
        infoType: link.type,
        modalTitle: link.name,
        uid: this.curUser.uid
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    await this.commDbService.fetchUserDoc(this.curUser.uid).then(
      res => {
        this.curUserDoc = res.data();
        this.setProgressBar();
      }
    );
  }

  setProgressBar(){
    var weight = 1/7;
    var counter = 0;
    var attributes = this.links.map(v=>{return v.type});
    attributes.forEach(v => {
      if(this.curUserDoc[v].length > 0) counter++;
    });

    this.pValue = (weight * counter).toFixed(2);
    this.pValueStr = (this.pValue*100).toFixed(0);

    if (this.pValueStr <= 20) {
      this.pColor = '#AAAAAA';
    } else if ( this.pValueStr <= 40) {
      this.pColor = '#b7d5ac';
    } else if ( this.pValueStr <= 60) {
      this.pColor = '#93bf85';
    } else if ( this.pValueStr <= 80) {
      this.pColor = '#6eaa5e';
    } else if ( this.pValueStr <= 100) {
      this.pColor = '#469536';
    }
  }

  refresh(e){
    if(!this.curUser){
      console.log("Please login first");
      e.target.complete();
      return;
    }
    this.commDbService.fetchUserDoc(this.curUser.uid).then(
      res => {
        this.setProgressBar();
        e.target.complete();
      }
    );
  }

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  async initialize(){
    const loading = await this.loadingController.create({
      message: "Loading resume...",
      duration: 10000
    });
    await loading.present();

    this.currentUserSubscription = this.loginService.currentUser.subscribe(
      user => {
        this.curUser = user;
        console.log("upi.page got current user:", this.curUser);
        if(user){
          this.commDbService.fetchUserDoc(user.uid).then(
              res => {
                this.curUserDoc = res.data();
                this.setProgressBar();
                this.loadingController.dismiss().catch(err=>console.warn(err));
                console.log("upi.page got current userdoc:", this.curUserDoc);
              }
            );
        }else{
          // TODO: Clean up function to end the lifecycle of the page
          //this.cleanUp();
          this.loadingController.dismiss().catch(err=>console.warn(err));
        }
      }
    );
    this.currentUserMetaDataSubscription = this.shareDataService.currentUserMetadata.subscribe(
      data => {
        this.curDisplayName = data.displayName;
        this.curAvatarUrl = data.avatarUrl;
      }
    );
  }

  async ngOnInit() {
    await this.initialize();
  }

}
