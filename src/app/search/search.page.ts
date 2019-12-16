import { Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { JobInfo } from '../job-card/job-card.module';
import { JobCardService } from '../job-card/job-card.service';
import { Observable } from 'rxjs';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { JobDetailPage } from '../job-detail/job-detail.page';
import { reject } from 'q';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit{
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
  tempList = [];
  newJob;
  ids: string[];
  navCtrl: NavController;
  @Output() newjobs = new EventEmitter<JobInfo[]>();

  // testt: Observable<any>;
  
  async updateJobList(){
    this.tempList = [];
    var temp;
    await this.jobser.get_jobinfo_db().then(res => {
      res.docs.forEach(doc => {
        temp = doc.data();
        temp['jid'] = doc.id;
        this.tempList.push(temp);
      })
    }, err => {reject(err); console.log("err",err)});
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
              public loadingController: LoadingController) {
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

  ngOnInit() {
    // this.jobs = this.jobser.get_jobinfo();
    // this.newjobs.emit(this.jobs);
    this.testLoading();
  }

}
