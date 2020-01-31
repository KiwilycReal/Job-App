import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-adv-detail',
  templateUrl: './adv-detail.page.html',
  styleUrls: ['./adv-detail.page.scss'],
})
export class AdvDetailPage implements OnInit {

  adv;
  curView = "description"

  imgSliderOpts = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
    speed: 1000,
  };

  lat = -23.8779431;
  lng = -49.8046873;
  zoom = 15;

  constructor(private modalController: ModalController) { }

  selfDismiss(){
    this.modalController.dismiss();
  }

  segmentChange(ev){
    this.curView = ev.detail.value;
  }

  ngOnInit() {
  }

}
