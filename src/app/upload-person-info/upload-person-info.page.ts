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
      if(this.loginService.curUser == undefined) return
      this.commDbService.fetchUserDoc(this.loginService.curUser.uid).then(
        res => {
          this.curUser = res.data();
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
  uid;
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
  links = [
    {name: "技能",
     type: "skills"},
    {name: "工作经验",
     type: "workExps"},
    {name: "教育经历",
     type: "eduExps"},
    {name: "项目经验",
     type: "projExps"},
    {name: "个人荣誉",
     type: "honors"},
    {name: "附件",
     type: "files"},
    {name: "个人简介",
     type: "description"},
  ];


  constructor(@Inject('commDbService') public commDbService,
              @Inject('loginService') public loginService,
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
    var curUser = this.loginService.curUser;
    if(!curUser){
      console.log("Please login first to edit personal info");
      return;
    }
    const modal = await this.modalController.create({
      component: InfoEditModalPage,
      componentProps: {
        infoType: a.type,
        modalTitle: a.name,
        uid: curUser.uid
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log("Perfect", data);
  }

  ngOnInit() {
  }

}
