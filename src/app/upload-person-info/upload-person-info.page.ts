import { Component, OnInit, ɵPlayState } from '@angular/core';

@Component({
  selector: 'app-upload-person-info',
  templateUrl: './upload-person-info.page.html',
  styleUrls: ['./upload-person-info.page.scss'],
})
export class UploadPersonInfoPage implements OnInit {
  title = 'Mr';
  name = 'CXK';
  pcolor: string;
  abilities = ['唱', '跳', 'RAP', '篮球', 'nmsl'];
  email = 'cxk@nmsl.com';
  phone = '123456789';
  value = 0.2;
  valueP = 100 * this.value;


  constructor() {
    if (this.value <= 0.2) {
      this.pcolor = 'medium';
    } else if (this.value <= 0.4) {
      this.pcolor = 'secondary';
    } else if (this.value <= 0.6) {
      this.pcolor = 'primary';
    } else if (this.value <= 0.8) {
      this.pcolor = 'tertiary';
    } else if (this.value === 1) {
      this.pcolor = 'success';
    }
  }

  ngOnInit() {
  }

}
