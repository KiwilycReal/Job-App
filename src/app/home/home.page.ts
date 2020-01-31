import { Component, Inject, OnInit } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { DomSanitizer} from '@angular/platform-browser';
import { AdvDetailPage } from '../adv-detail/adv-detail.page';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  
  showfooter = true;
  
  // A flag used to control ion-skeleton-text
  hasData = false;

  allAdvList = [];
  advList = [];
  segmentElem;

  // adv slider option
  Advslider = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
    speed: 1000,
  };

  // should be advs: Adv[]
  advSlides = [
    {
      ID: 'a1',
      ImageUrl: '../assets/adv/melbourne1.jpg',
      Detail: null
    },
    {
      ID: 'a2',
      ImageUrl: '../assets/adv/melbourne2.jpg',
      Detail: null
    }
  ];


  constructor(@Inject('commDbService') public commDbService,
              private sanitizer: DomSanitizer,
              private iab: InAppBrowser,
              private modalController: ModalController){
  }

  openPage(link="https://www.baidu.com"){
    this.iab.create(link);
  }

  // auto play slides
  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  segmentChange(ev){
    this.segmentElem = ev.target;
    var checked = ev.detail.value;
    if(checked == "all" || !checked) return this.advList = this.allAdvList;
    this.advList = this.allAdvList.filter(
      adv => {
        return checked == adv.type;
      }
    )
  }

  updateAdvList(){
    if(this.segmentElem) this.segmentElem.value = undefined;
    return this.commDbService.fetchAdvList().then(
      res => {
        var temp = {};
        var tempList = [];
        res.docs.forEach(
          doc => {
            temp = doc.data();
            temp["aid"] = doc.id;
            // temp["images"] = temp["images"].map(url=>{var s: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(url); return s});
            tempList.push(temp);
          }
        );
        this.advList = tempList;
        console.log(this.advList);
        this.allAdvList = tempList;
        this.hasData = true;
        return 0;
      }
    )
  }

  refresh(ev){
    this.updateAdvList().then(
      res => ev.target.complete(),
      err => {
        console.log("Found err when fetch advs: ",err);
        ev.target.complete()
      }
    );
  }

  async presentAdvModal(adv){
    const modal = await this.modalController.create({
      component: AdvDetailPage,
      componentProps: {
        adv: adv
      }
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
  }

  ngOnInit(){
    this.updateAdvList();
  }

}
