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

  async initialize(type){
    var authState: Observable<any> = this.loginService.curAuthState;
    await new Promise((resolve,reject) => {
      this.authSubscription = authState.subscribe(
        value => {
          console.log(value);
          if(value){
            this.isLogged = true;
            this.curUser = value;
            this.updateFavJobList(type);
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
        this.router.navigate(["login"]);
      }
    );
  }

  async presentLoading(loadMsg?: string) {
    const loading = await this.loadingController.create({
      message: loadMsg,
      duration: 10000
    });
    return loading;
  }

  async updateFavJobList(field: string = "favourite"){
    var loading;
    if(this.router.url.includes("jobs")){
      loading = await this.presentLoading("Loading...");
      await loading.present();
    }
    var jidList = [];
    //Handel when no one is logged in
    if(!this.curUser){
      console.log("yeah");
      this.router.navigate(["login"]);
      return;
    }
    await this.commDbService.fetchUserDoc(this.curUser.uid).then(
      res => {
        jidList = res.data()[field];
        return jidList;
      }
    ).then(
      res => {
        return this.commDbService.fetchFavJobList(res);
      }
    ).then(
      res => {
        console.log(res);
        this.jobs = res;
      }
    );
    if(loading) await this.loadingController.dismiss();

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

  changeFavAlert(elem){

  }

  ngOnInit() {
    var type;
    this.activatedRoute.data.subscribe((data)=>{console.log(data);type = data.msg})
    // console.log(window.history);
    // console.log(history.state);
    // console.log(this.router.getCurrentNavigation().extras.state);
    this.initialize(type);
  }
}
