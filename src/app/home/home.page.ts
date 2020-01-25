import { Component } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Alipay } from '@ionic-native/alipay/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  showfooter = true;
  
  // adv slider option
  Advslider = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
    speed: 1000,
  };

  // should be advs: Adv[]
  advs = [
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

  // auto play slides
  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

}
