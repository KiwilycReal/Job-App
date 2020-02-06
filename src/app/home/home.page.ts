import { Component, Inject, OnInit } from '@angular/core';
import { IonSlides, ModalController, LoadingController } from '@ionic/angular';
import { DomSanitizer} from '@angular/platform-browser';
import { JobDetailPage } from '../job-detail/job-detail.page';
// import { AdvDetailPage } from '../adv-detail/adv-detail.page';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  currentUserSubscription;
  
  showfooter = true;
  
  // A flag used to control ion-skeleton-text
  hasData = false;

  // allAdvList = [];
  // advList = [];
  curUser;
  jobs;
  allList;
  segmentElem;

  // adv slider option
  Advslider = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
    speed: 1000,
  };

  // should be advs: Adv[]
  advSlides = [
    {
      ID: 'a1',
      ImageUrl: '../assets/adv/melbourne1.jpg',
      Detail: null
    },
    {
      ID: 'a2',
      ImageUrl: '../assets/adv/melbourne2.jpg',
      Detail: null
    }
  ];


  constructor(@Inject('commDbService') public commDbService,
              @Inject('loginService') public loginService,
              // private sanitizer: DomSanitizer,
              private iab: InAppBrowser,
              private modalController: ModalController,
              private loadingController: LoadingController){
  }

  // updateAdvList(){
  //   if(this.segmentElem) this.segmentElem.value = undefined;
  //   return this.commDbService.fetchAdvList().then(
  //     res => {
  //       var temp = {};
  //       var tempList = [];
  //       res.docs.forEach(
  //         doc => {
  //           temp = doc.data();
  //           temp["aid"] = doc.id;
  //           // temp["images"] = temp["images"].map(url=>{var s: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(url); return s});
  //           tempList.push(temp);
  //         }
  //       );
  //       this.advList = tempList;
  //       console.log(this.advList);
  //       this.allAdvList = tempList;
  //       this.hasData = true;
  //       return 0;
  //     }
  //   )
  // }

  // refresh(ev){
  //   this.updateAdvList().then(
  //     res => ev.target.complete(),
  //     err => {
  //       console.log("Found err when fetch advs: ",err);
  //       ev.target.complete()
  //     }
  //   );
  // }

  // async presentAdvModal(adv){
  //   const modal = await this.modalController.create({
  //     component: AdvDetailPage,
  //     componentProps: {
  //       adv: adv
  //     }
  //   });
  //   await modal.present();
  //   const {data} = await modal.onWillDismiss();
  // }

  openPage(link="https://www.baidu.com"){
    this.iab.create(link);
  }

  // auto play slides
  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  segmentChange(ev){
    this.segmentElem = ev.target;
    var checked = ev.detail.value;
    if(checked == "all" || !checked) return this.jobs = this.allList;
    this.jobs = this.allList.filter(
      job => {
        return checked == job.type;
      }
    )
    // if(checked == "all" || !checked) return this.advList = this.allAdvList;
    // this.advList = this.allAdvList.filter(
    //   adv => {
    //     return checked == adv.type;
    //   }
    // )
  }

  async refresh(e){
    await this.updateJobList();
    e.target.complete();
  }

  async presentJobDetailModal(job){
    this.addToUserHistory(job.jid);
    const modal = await this.modalController.create({
      component: JobDetailPage,
      componentProps: {
        job: job,
        uid: this.curUser?this.curUser.uid:null
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.updateJobList();
  }

  addToUserHistory(jid){
    if(!this.curUser) return;
    this.commDbService.updateUserDocArray(this.curUser.uid, "history", jid, true).catch(
      err => console.log("Failed to add history", err)
    );
  }

  async initialize() {
    const loading = await this.loadingController.create({
      message: 'Loading jobs, Please wait...',
      duration: 10000
    });
    await loading.present();
    await this.updateJobList();
    await this.loadingController.dismiss().catch(err=>console.log("Failed to dismiss loading layer:",err));
  }

  updateJobList(){
    if(this.segmentElem) this.segmentElem.value = undefined;
    return this.fetchRequiredJobList().then(
      res => {
        this.jobs = res;
        this.allList = res;
    });
  }

  // The parameter here accept various job list fetch Promise, the default one fetches all jobs
  async fetchRequiredJobList(queryPromise: Promise<any> = this.commDbService.fetchJobList()){
    var temp;
    var tempList = [];
    
    await queryPromise.then(
      res => {
        res.docs.forEach(
          doc => {
            temp = doc.data();
            temp['jid'] = doc.id;
            temp['patternStr'] = temp.title.concat(temp.position);
            tempList.push(temp);
        });
    });
    return tempList;
  }

  ngOnInit(){
    // this.updateAdvList();
    this.currentUserSubscription = this.loginService.currentUser.subscribe(
      user => {
        console.log("search.page got current user:", user);
        this.curUser = user;
      }
    );
    // Set loading layer and job list updating
    this.initialize();
  }

}
