import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { AdvService } from '../adv/adv.service';
import { Adv } from '../adv/adv.module';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.page.html',
  styleUrls: ['./front-page.page.scss'],
})

export class FrontPagePage implements OnInit {

  constructor(private advSer: AdvService) {
  }

  advs: Adv[];
  @Output() newadvs = new EventEmitter<Adv[]>();

  Advslider = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
    speed: 1000,
  };

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  ngOnInit() {
    this.advs = this.advSer.get_advs();
  }

}
