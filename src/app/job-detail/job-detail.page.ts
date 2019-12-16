import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, IonSlide, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.page.html',
  styleUrls: ['./job-detail.page.scss'],
})
export class JobDetailPage implements OnInit {

  lat = -23.8779431;
  lng = -49.8046873;
  zoom = 15;

  data;
  title;
  position;
  salary;
  introText;
  details;
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
              navParams: NavParams) {
    this.data = navParams.data;
    // this.jid = this.data.jid;
    this.title = this.data.job.title;
    this.images = this.data.job.imageUrl;
    this.position = this.data.job.position;
    this.salary = this.data.job.salary;
    this.introText = this.data.job.introText;
    this.details = this.data.job.details;
    // this.geolocation = this.data.job.geolocation;
    console.log(this.data,this.images);
  }

  ngOnInit() {
  }

  async selfDismiss(){
    this.modalController.dismiss({
      dismissed: true
    })
  }

  // slidesDidLoad(hello: IonSlides){
  //   hello.startAutoplay();
  // }

}
