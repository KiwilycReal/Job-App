import { Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild, AfterViewInit, Inject, OnDestroy } from '@angular/core';
import { JobInfo } from '../job-card/job-card.module';
import { JobCardService } from '../job-card/job-card.service';
import { Observable, Subscription } from 'rxjs';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { JobDetailPage } from '../job-detail/job-detail.page';
import { reject } from 'q';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy{
  ngOnDestroy(): void {
    // this.authSubscription.
    console.log("search destroyed");
  }
  authSubscription: Subscription
  // ngAfterViewInit(): void {
  //   console.log("YES",this.hah);
  // }
  // @ViewChild('t') hah;
  public searchTerm: String = "";
  // @Input() teststr: ElementRef;
  // jobs: JobInfo[];
  // testt: JobInfo[] = [];
  // newJob: JobInfo;
  jobs =[];
  isLogged = true;
  o;
  tempList = [];
  newJob;
  ids: string[];
  navCtrl: NavController;
  curUser;
  // @Output() newjobs = new EventEmitter<JobInfo[]>();

  // testt: Observable<any>;
  
  async updateJobList(){
    this.tempList = [];
    var temp;
    await this.jobser.get_jobinfo_db().then(res => {
      res.docs.forEach(doc => {
        temp = doc.data();
        temp['jid'] = doc.id;
        temp['favIconName'] = "heart-empty";
        this.tempList.push(temp);
      })
    });
    //Handel when no one is logged in
    if(this.curUser){
      await this.commDbService.fetchUserDoc(this.curUser.uid).then(
        res => {
          this.tempList.forEach(
            value => {
              if(<string[]>res.data().favourite.includes(value.jid)) value.favIconName = "heart";
            }
          )
        }
      )
    }else{
      this.isLogged = false;
    }
    this.jobs = this.tempList;
  }

  refreshCard(event){
    console.log('Start');
    // console.dir(this.jobser.testdb());
    setTimeout(async () => {
      await this.updateJobList();
      console.log('Async operation has ended');
      event.target.complete();
    });
  }

  selectChange(ev){
    console.dir(ev);
  }

  testSearch(ev){
    console.dir(ev);
    console.dir(this.searchTerm);

  }

  initSearch(){
    console.log("search focus");
  }

  addJob(){
    let data = this.jobser.jobForm.value;
    this.jobser.createJob(data).then(res => console.log(res));
    // this.jobser.ttt();
  }

  cancelSearch(){
    // console.dir(this.jobser.testdb());
    this.jobs = this.jobser.get_jobinfo();
    // this.newjobs.emit(this.jobs);
  }

  async presentJobDetailModal(job){
    const modal = await this.modalController.create({
      component: JobDetailPage,
      componentProps: {
        test: "test",
        job: job
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
  }


  constructor(public jobser: JobCardService,
              public modalController: ModalController,
              public loadingController: LoadingController,
              @Inject('loginService') public loginService,
              @Inject('commDbService') public commDbService) {
  }

  async testLoading(errMsg?: string) {
    const loading = await this.loadingController.create({
      message: 'Loading jobs, Please wait...',
      duration: 10000
    });
    await loading.present();
    await this.updateJobList();
    await this.loadingController.dismiss();
  }

  async changeFavJob(elem){
    var jid = elem.id;
    var curUser = this.curUser;
    var isAdd = true;
    //Show spinner and hid heart
    elem.firstElementChild.style.display = "";
    elem.lastElementChild.style.display = "none";
    elem.disabled = true;
    //Check whether this job's fav status (html elem can be altered locally)
    await this.commDbService.fetchUserDoc(curUser.uid).then(
      res => {
        if(<string[]>res.data().favourite.includes(jid)) isAdd = false;
      }
    );
    //Database operations
    var iconStr = (isAdd) ? "heart" : "heart-empty";
    console.log(elem);
    if(curUser){
      this.commDbService.updateUserDocArray(curUser.uid, "favourite", jid, isAdd).then(
        res => {
          elem.lastElementChild.name = iconStr;
          elem.firstElementChild.style.display = "none";
          elem.lastElementChild.style.display = "";
          elem.disabled = false;
        });
    }else{
      console.log("Please login first");
    }
  }

  ngOnInit() {
    // this.jobs = this.jobser.get_jobinfo();
    // this.newjobs.emit(this.jobs);
    
    var authState: Observable<any> = this.loginService.curAuthState;
    console.log("before sub");
    // this.authSubscription = authState.subscribe({
    //   next(v) {console.log(v);this.curUser = v;},
    //   error(e) {console.log(e)},
    //   complete() {console.log("done")}
    // });
    this.authSubscription = authState.subscribe(
      value => {
        console.log(value);
        this.curUser = value;
        if(this.curUser){
          this.isLogged = true;
        }else{
          this.isLogged = false;
        }
      });

    this.testLoading();
    // this.authSubscription.
  }

}
