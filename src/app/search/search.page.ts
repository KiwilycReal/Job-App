import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { Observable} from 'rxjs';
import { ModalController, LoadingController } from '@ionic/angular';
import { JobDetailPage } from '../job-detail/job-detail.page';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy{

  @ViewChild('clearSelectBtn', {static: true}) clearSelectBtnElem;

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
  
  searchTerm: String = "";

  workTypeSelect;
  jobTypeSelect;
  salarySelect;
  workTypeOpts = [
    {value: null,
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
    {value: null,
     display: "ALL"},
    {value: "black",
     display: "Black Job"},
    {value: "white",
     display: "White Job"}
  ];
  salaryOpts = [
    {value: null,
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

  selectChange(ev){
    if(ev.detail.value == null) return;
    if(this.workTypeSelect == null &&
       this.jobTypeSelect == null &&
       this.salarySelect == null){
      this.clearSelectBtnElem.el.style.display = "none";
      return;
    }
    var candidates = this.allList;
    var tempList = [];
    var lower = 0;
    var upper = 10000000;
    this.clearSelectBtnElem.el.style.display = "";
    
    if(this.salarySelect){
      lower = this.salarySelect.lower;
      upper = this.salarySelect.upper;
    }
    if(this.workTypeSelect){
      candidates = candidates.filter(
        job => {
          return job.tags.includes(this.workTypeSelect)
        }
      )
    }
    if(this.jobTypeSelect){
      candidates = candidates.filter(
        job => {
          return job.tags.includes(this.jobTypeSelect)
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

  addJob(){
    let data = this.commDbService.newJobForm.value;
    data.tags = data.tags.split(";").filter(tag=>{return tag!=""});
    this.commDbService.createJob(data).then(
      res => console.log(res),
      err => console.log(err)
    );
  }

  refreshCard(e){
    setTimeout(async () => {
      await this.updateJobList();
      e.target.complete();
    });
  }

  async presentJobDetailModal(job){
    this.addToUserHistory(job.jid);
    const modal = await this.modalController.create({
      component: JobDetailPage,
      componentProps: {
        job: job,
        uid: this.curUser.uid
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

  // async changeFavJob(elem){
  //   var jid = elem.id;
  //   var curUser = this.curUser;
  //   var isAdd = true;
  //   if(!curUser) return;
  //   //Show spinner and hid heart
  //   elem.firstElementChild.style.display = "";
  //   elem.lastElementChild.style.display = "none";
  //   elem.disabled = true;
  //   //Check this job's fav status (html elem can be altered locally)
  //   await this.commDbService.fetchUserDoc(curUser.uid).then(
  //     res => {
  //       if(<string[]>res.data().favourite.includes(jid)) isAdd = false;
  //     }
  //   );
  //   //Database operations
  //   var iconStr = (isAdd) ? "heart" : "heart-empty";
  //   console.log(elem);
  //   if(curUser){
  //     this.commDbService.updateUserDocArray(curUser.uid, "favourite", jid, isAdd).then(
  //       res => {
  //         elem.lastElementChild.name = iconStr;
  //         elem.firstElementChild.style.display = "none";
  //         elem.lastElementChild.style.display = "";
  //         elem.disabled = false;
  //       });
  //   }else{
  //     console.log("Please login first");
  //   }
  // }

  async initialize() {
    const loading = await this.loadingController.create({
      message: 'Loading jobs, Please wait...',
      duration: 10000
    });
    await loading.present();
    await this.updateJobList();
    await this.loadingController.dismiss();
  }

  async updateJobList(){
    if(this.typeRadioGroup) this.typeRadioGroup.value = undefined;
    var tempList = [];

    await this.fetchRequiredJobList().then(
      res => {
        tempList = res;
    });
    // this.jobs = tempList;
    this.allList = tempList;
    this.clearSelect();
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
            // temp['isApplied'] = false;
            // temp['favIconName'] = "heart-empty";
            temp['patternStr'] = temp.title.concat(temp.position);
            tempList.push(temp);
        });
    });
    //Update jobs' user fav status if someone logged
    // if(this.curUser){
    //   await this.commDbService.fetchUserDoc(this.curUser.uid).then(
    //     res => {
    //       tempList.forEach(
    //         value => {
    //           if(<string[]>res.data().favourite.includes(value.jid)) value.favIconName = "heart";
    //           if(<string[]>res.data().applied.includes(value.jid)) value.isApplied = true;
    //       });
    //   });
    // }else{
    //   this.isLogged = false;
    // }
    return tempList;
  }

  ngOnInit() {
    var authState: Observable<any> = this.loginService.curAuthState;
    authState.subscribe(
      value => {
        this.curUser = value;
        if(this.curUser){
          this.isLogged = true;
        }else{
          this.isLogged = false;
        }
      });

    this.initialize();
  }

}
