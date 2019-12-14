import { Component, OnInit, ɵPlayState, Inject, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InfoEditModalPage } from '../info-edit-modal/info-edit-modal.page'

@Component({
  selector: 'app-upload-person-info',
  templateUrl: './upload-person-info.page.html',
  styleUrls: ['./upload-person-info.page.scss'],
})
export class UploadPersonInfoPage implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    if(this.isFirst){
      this.commDbService.fetchUserDoc(this.uid).subscribe(
        res => {
          this.curUser = res.payload.data();
          console.log("Fetched",this.curUser);
          this.email = this.curUser.email;
          this.title = this.curUser.title;
          this.workExp = this.curUser.workExp;
        }
      );
      this.isFirst = false;
    }
  }

  isFirst = true;
  email;
  curUser;
  uid = 'a5VpypBHqyc6PlsIFf7GQFKHfPk1';
  title;
  name = 'CXK';
  pcolor: string;
  // skills: string[];
  workExp;
  projectExp;
  eduExp;
  skills = ['唱', '跳', 'RAP', '篮球', 'nmsl'];
  phone = '123456789';
  value = 0.6;
  valueP = 100 * this.value;
  btn;


  constructor(@Inject('commDbService') public commDbService,
              public modalController: ModalController) {
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

  editSkills(a){
    console.log(a);
    if(a.target.name == "add"){
      a.target.name = "remove";
    }else{
      a.target.name = "add";
    }
  }

  async presentInfoEditModal(a){
    const modal = await this.modalController.create({
      component: InfoEditModalPage,
      componentProps: {
        type: "work",
        title: a.target.firstChild.innerHTML,
        // list: this.workExp,
        uid: this.uid
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log("Perfect", data);
  }

  ngOnInit() {
  }

}
