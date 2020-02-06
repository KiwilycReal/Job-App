import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
// import { Observable} from 'rxjs';
import { ModalController, LoadingController } from '@ionic/angular';
import { JobDetailPage } from '../job-detail/job-detail.page';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy{

  @ViewChild('clearSelectBtn', {static: true}) clearSelectBtnElem;

  // The current user subscription
  currentUserSubscription;

  constructor(public modalController: ModalController,
              public loadingController: LoadingController,
              @Inject('loginService') public loginService,
              @Inject('commDbService') public commDbService) {}

  ngOnDestroy(): void {
    console.log("search destroyed");
  }

  curUser;
  isLogged = true;
  
  jobs =[];
  allList = [];
  searchList = [];

  // The work type radio group
  typeRadioGroup;
  
  // searchTerm: String = "";

  workTypeSelect;
  jobTypeSelect;
  salarySelect;
  workTypeOpts = [
    {value: "all",
     display: "ALL"},
    {value: "fulltime",
     display: "Full Time"},
    {value: "parttime",
     display: "Part Time"},
    {value: "intern",
     display: "Intern"},
    {value: "volunteer",
     display: "Volunteer"},
    {value: "spring",
     display: "春招"},
    {value: "autumn",
     display: "秋招"},
    {value: "chinaintern",
     display: "中国Intern"},
  ];
  jobTypeOpts = [
    {value: "all",
     display: "ALL"},
    {value: "black",
     display: "Black Job"},
    {value: "white",
     display: "White Job"}
  ];
  salaryOpts = [
    {value: {lower:0,upper:Number.MAX_SAFE_INTEGER},
     display: "ALL"},
    {value: {lower:50,upper:100},
     display: "50-100"},
    {value: {lower:100,upper:150},
     display: "100-150"},
    {value: {lower:150,upper:10000},
     display: "150+"}
  ];

  // tst(e){
  //   console.log(e);
  // }

  // blur(){
  //   console.log("blur");
  // }

  // async startSearch(){
  //   var tempList = [];
  //   var regExStr = "";
  //   this.searchTerm.split("").forEach(
  //     v => {
  //       regExStr += v.concat("?");
  //     }
  //   );
  //   var regExp = new RegExp(regExStr, "g");
  //   await this.fetchRequiredJobList().then(
  //     res => {
  //       tempList = res;
  //       this.allList = tempList;
  //     }
  //   );
  //   //Start filtering result
  //   tempList = tempList.sort(
  //     (j1, j2) => {
  //       var score1 = 0, score2 = 0;
  //       var temp1, temp2;
  //       temp1 = j1.patternStr.match(regExp);
  //       temp2 = j2.patternStr.match(regExp);
  //       if(temp1) score1 = temp1.filter(e=>{return e!=""}).length;
  //       if(temp2) score2 = temp2.filter(e=>{return e!=""}).length;
  //       return score2-score1;
  //     }
  //   );
  //   this.jobs = tempList;
  // }

  // selectChange(ev){
  //   console.dir(ev);
  // }

  // initSearch(){
  //   console.log("search focus");
  // }

  // async searchByPay(range){
  //   await this.fetchRequiredJobList(this.commDbService.fetchJobsByPay(range)).then(
  //     res => {
  //       this.jobs = res;
  //     }
  //   )
  // }

  // cancelSearch(){}

  selectChange(ev){
    if(ev.detail.value == null) return;
    if(this.workTypeSelect == null &&
       this.jobTypeSelect == null &&
       this.salarySelect == null){
      this.clearSelectBtnElem.el.style.display = "none";
      return;
    }
    var candidates = this.allList;
    var lower = 0;
    var upper = Number.MAX_SAFE_INTEGER;
    this.clearSelectBtnElem.el.style.display = "";
    
    if(this.salarySelect){
      lower = this.salarySelect.lower;
      upper = this.salarySelect.upper;
    }
    if(this.workTypeSelect){
      candidates = candidates.filter(
        job => {
          return job.tags.includes(this.workTypeSelect) || this.workTypeSelect == "all"
        }
      )
    }
    if(this.jobTypeSelect){
      candidates = candidates.filter(
        job => {
          return job.tags.includes(this.jobTypeSelect) || this.jobTypeSelect == "all"
        }
      )
    }
    this.jobs = candidates.filter(
      job => {
        return job.salary >= lower && job.salary < upper;
      }
    ).sort(
      (j1, j2) => {
        return j2.salary - j1.salary;
      }
    );
  }

  clearSelect(){
    this.workTypeSelect = null;
    this.jobTypeSelect = null;
    this.salarySelect = null;

    this.jobs = this.allList;
  }

  radioChange(ev){
    this.typeRadioGroup = ev.target;
    var selected = ev.detail.value
    if(selected){
      this.jobs = this.allList.filter(
        job => {
          return job.type == selected;
        }
      );
    }else{
      // Restore the full job list
      this.jobs = this.allList;
    }
  }

  addJob(){
    let data = this.commDbService.newJobForm.value;
    data.tags = data.tags.split(";").filter(tag=>{return tag!=""});
    this.commDbService.createJob(data).then(
      res => console.log(res),
      err => console.log(err)
    );
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
    this.clearSelect();
    // if(this.typeRadioGroup) this.typeRadioGroup.value = undefined;
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

  ngOnInit() {
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
