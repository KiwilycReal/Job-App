import { Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild, AfterViewInit, Inject, OnDestroy } from '@angular/core';
import { JobInfo } from '../job-card/job-card.module';
import { JobCardService } from '../job-card/job-card.service';
import { Observable, Subscription } from 'rxjs';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { JobDetailPage } from '../job-detail/job-detail.page';
import { reject } from 'q';
import { removeSummaryDuplicates } from '@angular/compiler';

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
  allList = [];
  isLogged = true;
  o;
  newJob;
  ids: string[];
  navCtrl: NavController;
  curUser;
  // @Output() newjobs = new EventEmitter<JobInfo[]>();

  // testt: Observable<any>;
  
  async fetchLatestJobList(queryPromise: Promise<any> = this.jobser.get_jobinfo_db()){
    var temp;
    var tempList = [];
    
    await queryPromise.then(res => {
      res.docs.forEach(doc => {
        temp = doc.data();
        temp['jid'] = doc.id;
        temp['favIconName'] = "heart-empty";
        temp['patternStr'] = temp.title.concat(temp.position);
        tempList.push(temp);
      })
    });
    if(this.curUser){
      await this.commDbService.fetchUserDoc(this.curUser.uid).then(
        res => {
          tempList.forEach(
            value => {
              if(<string[]>res.data().favourite.includes(value.jid)) value.favIconName = "heart";
            }
          )
        }
      )
    }else{
      this.isLogged = false;
    }
    return tempList;
  }

  async updateJobList(){
    var tempList = [];

    await this.fetchLatestJobList().then(
      res => {
        tempList = res;
      }
    )

    //Handel when no one is logged in
    this.jobs = tempList;
    this.allList = tempList;
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

  tst(e){
    console.log(e);
  }

  blur(){
    console.log("blur");
  }

  async startSearch(){
    var searchResult = [];
    var tempList = [];
    var temp;
    var regExStr = "";
    this.searchTerm.split("").forEach(
      v => {
        regExStr += v.concat("?");
      }
    );
    var regExp = new RegExp(regExStr, "g");
    await this.fetchLatestJobList().then(
      res => {
        tempList = res;
        this.allList = tempList;
      }
    );
    //Start filtering result
    tempList = tempList.sort(
      (j1, j2) => {
        var score1 = 0, score2 = 0;
        var temp1, temp2;
        temp1 = j1.patternStr.match(regExp);
        temp2 = j2.patternStr.match(regExp);
        if(temp1) score1 = temp1.filter(e=>{return e!=""}).length;
        if(temp2) score2 = temp2.filter(e=>{return e!=""}).length;
        return score2-score1;
      }
    );
    this.jobs = tempList;
  }

  selectChange(ev){
    console.dir(ev);
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
    // this.jobs = this.jobser.get_jobinfo();
    // this.newjobs.emit(this.jobs);
  }

  async searchByPay(range){
    await this.fetchLatestJobList(this.commDbService.fetchJobsByPay(range)).then(
      res => {
        this.jobs = res;
      }
    )
  }

  async presentJobDetailModal(job){
    this.addToUserHistory(job.jid);
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

  addToUserHistory(jid){
    if(!this.curUser) return;

    this.commDbService.updateUserDocArray(this.curUser.uid, "history", jid, true);
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
