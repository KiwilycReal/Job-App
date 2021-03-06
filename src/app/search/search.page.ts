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

  searchTerm;
  
  jobs =[];
  allList = [];
  tempFilterList = [];

  // The work type radio group
  typeRadioGroup;
  
  // searchTerm: String = "";

  workTypeSelect;
  jobTypeSelect;
  salarySelect;
  // Opts for the range element
  // salaryRange = {
  //   lower: 25,
  //   upper: 100
  // };
  workTypeOpts = [
    {value: "full",
     display: "全职"},
    {value: "part",
     display: "兼职"},
    {value: "intern",
     display: "实习"},
    {value: "fast",
     display: "快聘"}
  ];
  jobTypeOpts = [
    {value: "cashier",
     display: "收银员"},
    {value: "customerService",
    display: "客服"},
    {value: "teller",
    display: "柜员"},
    {value: "bank",
    display: "银行"},
    {value: "telecom",
    display: "通讯公司"},
    {value: "retail",
    display: "零售业"}
  ];
  salaryOpts = [
    {value: {lower:25,upper:30},
     display: "25-30"},
    {value: {lower:30,upper:45},
     display: "30-45"},
    {value: {lower:45,upper:60},
     display: "45-60"},
    {value: {lower:60,upper:Number.MAX_SAFE_INTEGER},
     display: "60+"}
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

  // TODO: 或者判断每次变更select是增加条件还是减少条件，来取(以新变更条件筛选过的alllist)和(先前的tempfilterlist)的交/并集
  selectChange(ev){
    if(this.workTypeSelect.length == 0 &&
       this.jobTypeSelect.length == 0 &&
       this.salarySelect.length == 0){
      this.jobs = this.allList;
      this.clearSelectBtnElem.el.style.display = "none";
      return;
    }
    var candidates = this.allList;
    this.clearSelectBtnElem.el.style.display = "";

    if(this.workTypeSelect.length > 0){
      candidates = candidates.filter(
        job => {
          // return job.tags.some(tag=>this.workTypeSelect.includes(tag));
          return this.workTypeSelect.includes(job.type);
        }
      );
    }
    if(this.jobTypeSelect.length > 0){
      candidates = candidates.filter(
        job => {
          return job.jobCat.some(tag=>this.jobTypeSelect.includes(tag));
        }
      );
    }
    if(this.salarySelect.length > 0){
      candidates = candidates.filter(
        job => {
          var temp = job.salary;
          return this.salarySelect.some(
            condition => {
              return temp >= condition.lower && temp <= condition.upper;
            }
          )
        }
      ).sort(
        (j1, j2) => {
          return j2.salary - j1.salary;
        }
      );
    }

    this.tempFilterList = candidates;
    this.jobs = candidates;
    // this.jobs = candidates;
    // this.jobs = candidates.filter(
    //   job => {
    //     return job.salary >= lower && job.salary < upper;
    //   }
    // ).sort(
    //   (j1, j2) => {
    //     return j2.salary - j1.salary;
    //   }
    // );
  }

  // salaryChange(){
  //   if(this.salaryRange.lower == 20 && this.salaryRange.upper == 200) return;
  //   this.jobs = this.tempFilterList.filter(
  //     job => {
  //       return job.salary >= this.salaryRange.lower && job.salary <= this.salaryRange.upper;
  //     }
  //   ).sort(
  //     (j1, j2) => {
  //       return j2.salary - j1.salary;
  //     }
  //   );
  // }

  clearSelect(){
    this.workTypeSelect = [];
    this.jobTypeSelect = [];
    this.salarySelect = [];
    // this.salaryRange = {lower: 20, upper: 200};

    this.jobs = this.allList;
    // this.tempFilterList = this.allList;
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
        this.tempFilterList = res;
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
