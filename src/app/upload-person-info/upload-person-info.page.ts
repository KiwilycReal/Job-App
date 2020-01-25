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
  isLogged = false;

  pValue;
  pValueStr;
  pColor: string;


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
    await this.commDbService.fetchUserDoc(this.curUser.uid).then(
      res => {this.curUserDoc = res.data()}
    );
    console.log(data);
    this.curDisplayName = data.displayName;
    this.shareDataService.changeUserMetadata({
      displayName: this.curDisplayName,
      avatarUrl: "https://gravatar.com/avatar"
    });
    this.setProgressBar();
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
      res => {this.curUserDoc = res.data()}
    );
    this.setProgressBar();
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

    // Used to set the color of the deperacted progress bar
    // if (this.pValue <= 0.2) {
    //   this.pColor = 'medium';
    // } else if (this.pValue <= 0.4) {
    //   this.pColor = 'secondary';
    // } else if (this.pValue <= 0.6) {
    //   this.pColor = 'primary';
    // } else if (this.pValue <= 0.8) {
    //   this.pColor = 'tertiary';
    // } else if (this.pValue === 1) {
    //   this.pColor = 'success';
    // }
  }

  refresh(e){
    if(!this.curUser){
      console.log("Please login first");
      e.target.complete();
      return;
    }
    setTimeout(async () => {
      await this.commDbService.fetchUserDoc(this.curUser.uid).then(
        res => {this.curUserDoc = res.data()}
      );
      this.setProgressBar();
      e.target.complete();
    });
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
    var authState: Observable<any> = this.loginService.curAuthState;
    await new Promise((resolve, reject) => {
      authState.subscribe(
        async value => {
          if(value){
            this.isLogged = true;
            this.curUser = value;
            this.curDisplayName = value.displayName;
            this.curAvatarUrl = value.photoURL;
            await this.commDbService.fetchUserDoc(this.curUser.uid).then(
              res => this.curUserDoc = res.data()
            )
            this.setProgressBar();
            this.loadingController.dismiss().catch(err => console.log("Find loadingCtrl err: ", err));
            console.log(this.curUserDoc);
          }else{
            this.isLogged = false;
            console.log("No one is logged in!");
            this.loadingController.dismiss().catch(err => console.log("Find loadingCtrl err: ", err));
          }
      });
    });
  }

  async ngOnInit() {
    await this.initialize();
  }

}
