import { Component, OnInit, Inject } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { reject } from 'q';
import * as InfoInterfaces from '../interfaces/resume-interfaces'

@Component({
  selector: 'app-info-edit-modal',
  templateUrl: './info-edit-modal.page.html',
  styleUrls: ['./info-edit-modal.page.scss'],
})
export class InfoEditModalPage implements OnInit {

  startDate;
  endDate;
  entityName;
  major;
  grade;
  level;
  geolocation;
  position;
  name;
  title;
  description;
  skill;
  file;
  
  editStartDate;
  editEndDate;
  editEntityName;
  editMajor;
  editGrade;
  editLevel;
  editGeolocation;
  editPosition;
  editName;
  editTitle;
  editDescription;

  /*Will be automatically initialized by the parent page
  when this modal showing*/
  uid;
  list;
  infoType: string;
  editMode: boolean = false;

  curEditPanel

  constructor(public modalController: ModalController,
              public loadingController: LoadingController,
              @Inject('commDbService') public commDbService,
              public navParams: NavParams) {
    
  }

  async selfDismiss() {
    this.modalController.dismiss({
      dismissed: true
    })
  }

  //Can be optimized by using formGroup rather than normal interface
  async addExp(){
    const loading = await this.loadingController.create({
      message: 'Processing',
      duration: 15000
    });
    await loading.present();
    var baseExp = {
      startDate: this.startDate,
      endDate: this.endDate,
      entityName: this.entityName,
      description: this.description
    };
    switch(this.infoType){
      case "eduExps":
        baseExp['major'] = this.major;
        baseExp['grade'] = this.grade;
        baseExp['level'] = this.level;
        baseExp['geolocation'] = this.geolocation;
        break;
      case "projExps":
        baseExp['position'] = this.position;
        baseExp['name'] = this.name;
        break;
      case "workExps":
        baseExp['geolocation'] = this.geolocation;
        baseExp['position'] = this.position;
        break;
      case "honors":
        baseExp['title'] = this.title;
        break;
    }
    let data = baseExp;
    await this.commDbService.updateUserDocArray(this.uid, this.infoType, data, true).then(res => {
      console.log("Added new ",this.infoType," for "+this.uid, res);
    }, err => reject(err));
    await this.refresh();
    this.loadingController.dismiss();
  }

  async deleteExp(id:number){
    const loading = await this.loadingController.create({
      message: 'Deleting...',
      duration: 15000
    });
    await loading.present();
    let data= this.list[id];
    delete data.id;
    console.log("gonna deleted:",data);
    await this.commDbService.updateUserDocArray(this.uid, this.infoType, data, false).then(res => {
      console.log("Removed work exp for "+this.uid, res);
    }, err => reject(err));
    await this.refresh();
    this.loadingController.dismiss();
  }

  editExp(expItem){
    expItem.close();
    if(this.curEditPanel) this.curEditPanel.style.display = "none"
    this.curEditPanel = expItem.children[0].firstElementChild.lastElementChild;
    this.curEditPanel.style.display = "";
  }

  cancelEditPanel(){
    this.curEditPanel.style.display = "none";
  }

  async uploadEdit(id){
    const loading = await this.loadingController.create({
      message: 'Processing',
      duration: 15000
    });
    await loading.present();
    //First delete the old version
    let oldData= this.list[id];
    delete oldData.id;
    console.log("gonna deleted:",oldData);
    await this.commDbService.updateUserDocArray(this.uid, this.infoType, oldData, false).then(res => {
      console.log("Removed work exp for "+this.uid, res);
    }, err => reject(err));
    //Start add the edited exp
    var baseExp = {
      startDate: this.editStartDate,
      endDate: this.editEndDate,
      entityName: this.editEntityName,
      description: this.editDescription
    };
    switch(this.infoType){
      case "eduExps":
        baseExp['major'] = this.editMajor;
        baseExp['grade'] = this.editGrade;
        baseExp['level'] = this.editLevel;
        baseExp['geolocation'] = this.editGeolocation;
        break;
      case "projExps":
        baseExp['position'] = this.editPosition;
        baseExp['name'] = this.editName;
        break;
      case "workExps":
        baseExp['geolocation'] = this.editGeolocation;
        baseExp['position'] = this.editPosition;
        break;
      case "honors":
        baseExp['title'] = this.editTitle;
        break;
    }
    let newData = baseExp;
    await this.commDbService.updateUserDocArray(this.uid, this.infoType, newData, true).then(res => {
      console.log("Added new ",this.infoType," for "+this.uid, res);
    }, err => reject(err));
    await this.refresh();
    this.curEditPanel.style.display = "none";
    this.loadingController.dismiss();
  }

  async addSkill(){
    const loading = await this.loadingController.create({
      message: 'Adding...',
      duration: 15000
    });
    await loading.present();
    await this.commDbService.updateUserDocArray(this.uid, "skills", this.skill, true);
    await this.refresh();
    this.loadingController.dismiss();
  }

  async deleteSkill(skill: string){
    const loading = await this.loadingController.create({
      message: 'Deleting...',
      duration: 15000
    });
    await loading.present();
    await this.commDbService.updateUserDocArray(this.uid, "skills", skill, false);
    await this.refresh();
    this.loadingController.dismiss();
  }

  async updateDescription(){
    const loading = await this.loadingController.create({
      message: 'Uploading...',
      duration: 15000
    });
    await loading.present();
    await this.commDbService.updateUserDoc(this.uid, {description: this.description});
    this.loadingController.dismiss();
  }

  getCurrentFile(f){
    this.file = f;
    // console.log(f);
  }

  async addFile(){
    const loading = await this.loadingController.create({
      message: 'Adding...',
      duration: 20000
    });
    await loading.present();
    await this.commDbService.uploadFile(this.file, this.uid).then(
      res => {
        this.commDbService.updateUserDocArray(this.uid, this.infoType, this.file.name, true);
      }
    );
    await this.refresh();
    this.loadingController.dismiss();
    // this.commDbService.listFiles(this.uid).then(
    //   res => console.log(res)
    // )
  }

  async refresh(){
    await this.commDbService.fetchUserDoc(this.uid).then(
      res => {
        var tempList = res.data()[this.infoType];
        if(!(typeof tempList[0] === "string")) tempList.map((item, index) => {item.id = index});
        this.list = tempList;
      }
    );
  }

  async initilize(){
    const loading = await this.loadingController.create({
        message: 'Loading...',
        duration: 15000
      });
    await loading.present();
    if(this.infoType != "description"){
      await this.refresh();
    }else{
      await this.commDbService.fetchUserDoc(this.uid).then(
        res => {
          this.description = res.data().description;
        }
      )
    }

    this.loadingController.dismiss();
    console.log("Modal received", this.navParams.data);
  }

  ngOnInit() {
    this.initilize();
  }

}
