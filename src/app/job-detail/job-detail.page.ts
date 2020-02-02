import { Component, OnInit, Inject } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.page.html',
  styleUrls: ['./job-detail.page.scss'],
})
export class JobDetailPage implements OnInit {

  lat = -23.8779431;
  lng = -49.8046873;
  zoom = 15;

  // Initialized when the modal created
  job;
  uid;

  isFavoured = false;
  isApplied = false;

  curView = "description";

  geolocation = "VIC 3166";
  images :string[];
  imgSliderOpts = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
    speed: 1000,
  };

  constructor(public modalController: ModalController,
              public loadingController: LoadingController,
              @Inject('commDbService') public commDbService) {
  }

  async selfDismiss(){
    this.modalController.dismiss({
      dismissed: true
    })
  }

  segmentChanged(ev){
    this.curView = ev.detail.value;
  }

  // slidesDidLoad(hello: IonSlides){
  //   hello.startAutoplay();
  // }

  changeFavBtn(elem){
    this.buttomBtnAction(!this.isFavoured, "favourite").then(
      res => this.isFavoured = !this.isFavoured,
      err => console.log("Failed to change fav status", err)
    );
    
  }

  changeApplyBtn(){
    this.buttomBtnAction(!this.isApplied, "applied").then(
      res => this.isApplied = !this.isApplied,
      err => console.log("Failed to change apply status", err)
    );
  }

  async buttomBtnAction(becomeActivated: boolean, actionType: string){
    const loading = await this.loadingController.create({
      message: '请稍后...',
      duration: 20000
    });
    await loading.present();
    //Check this job's fav status (html elem can be altered locally)
    await this.commDbService.fetchUserDoc(this.uid).then(
      res => {
        if(<string[]>res.data()[actionType].includes(this.job.jid)) becomeActivated = false;
      }
    );
    //Database operations
    this.commDbService.updateUserDocArray(this.uid, actionType, this.job.jid, becomeActivated).then(
      res => this.loadingController.dismiss(),
      err => this.loadingController.dismiss()
    );
  }


  async ngOnInit() {
    if(!this.uid){
      console.log("No one is logged, only showing content");
      return;
    }
    const loading = await this.loadingController.create({
      message: '请稍后...',
      duration: 20000
    });
    await loading.present();
    // Check fav and apply status
    this.commDbService.fetchUserDoc(this.uid).then(
      res => {
        var data = res.data();
        this.isFavoured = data.favourite.includes(this.job.jid);
        this.isApplied = data.applied.includes(this.job.jid);
        this.loadingController.dismiss().catch(err=>console.log(err));
      },
      err => {
        console.log("Failed to fetch userdoc", err);
        this.loadingController.dismiss().catch(err=>console.log(err));
      }
    )
  }

}
