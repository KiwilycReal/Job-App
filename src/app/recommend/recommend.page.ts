import { Component, OnInit, Inject } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AdvDetailPage } from '../adv-detail/adv-detail.page';

@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.page.html',
  styleUrls: ['./recommend.page.scss'],
})
export class RecommendPage implements OnInit {

  advs = [];

  constructor(@Inject('commDbService') public commDbService,
              private loadingController: LoadingController,
              private modalController: ModalController) { }

  async presentAdvDetailModal(adv){
    const modal = await this.modalController.create({
      component: AdvDetailPage,
      componentProps: {
        adv: adv
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.updateAdvList();
  }

  async refresh(ev){
    await this.updateAdvList();
    ev.target.complete()
  }

  updateAdvList(){
    return this.commDbService.fetchAdvList().then(
      res => {
        var tempList = [];
        res.docs.forEach(
          doc => {
            var temp = doc.data();
            tempList.push(temp);
          }
        );
        this.advs = tempList;
        this.loadingController.dismiss().catch(err=>console.warn(err));
      }
    )
  }

  async initialize(){
    const loading = await this.loadingController.create({
      message: "加载中...",
      duration: 15000
    });
    await loading.present();
    this.updateAdvList();
  }

  ngOnInit() {
    this.initialize();
  }

}
