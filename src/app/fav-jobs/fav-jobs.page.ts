import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { JobDetailPage } from '../job-detail/job-detail.page';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fav-jobs',
  templateUrl: './fav-jobs.page.html',
  styleUrls: ['./fav-jobs.page.scss'],
})
export class FavJobsPage implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    console.log("fav destroyed");
  }

  jobs = [];

  isLogged = false;

  type: string;

  authSubscription: Subscription;

  curUser;

  constructor(@Inject('commDbService') public commDbService,
              @Inject('loginService') public loginService,
              public modalController: ModalController,
              public loadingController: LoadingController,
              public router: Router,
              public activatedRoute: ActivatedRoute) {
      console.log("fav constructor");
  }

  refresh(e){
    setTimeout(async () => {
      await this.updateFavJobList().catch(err => {
        console.log(err);
      });
      e.target.complete();
    });
  }

  async deleteJobCard(jid){
    const loading = await this.loadingController.create({
      message: 'Deleting...',
      duration: 15000
    });
    await loading.present();
    await this.commDbService.updateUserDocArray(this.curUser.uid, this.type, jid, false);
    await this.updateFavJobList();
  }

  async initialize(){
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 15000
    });
    await loading.present();
    var authState: Observable<any> = this.loginService.curAuthState;
    await new Promise((resolve,reject) => {
      this.authSubscription = authState.subscribe(
        value => {
          console.log(value);
          if(value){
            this.isLogged = true;
            this.curUser = value;
            this.updateFavJobList();
            resolve(value);
          }else{
            this.isLogged = false;
            reject("请先登录，而后刷新");
          }
        }
      );
    }).catch(
      err => {
        console.log(err);
        this.loadingController.dismiss();
        this.router.navigate(["login"]);
      }
    );
  }

  async updateFavJobList(){
    var jidList = [];
    //Handel when no one is logged in
    if(!this.curUser){
      this.router.navigate(["login"]);
      return;
    }
    await this.commDbService.fetchUserDoc(this.curUser.uid).then(
      res => {
        jidList = res.data()[this.type];
        return jidList;
      }
    ).then(
      res => {
        return this.commDbService.fetchPartialJobList(res);
      }
    ).then(
      res => {
        console.log(res);
        this.jobs = res;
      }
    );
    await this.loadingController.dismiss();

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

  ngOnInit() {
    this.activatedRoute.data.subscribe((data)=>{console.log(data);this.type = data.msg})
    
    this.initialize();
  }
}
