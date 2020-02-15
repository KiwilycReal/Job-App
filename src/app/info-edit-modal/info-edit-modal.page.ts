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

  clearInput(){
    this.startDate = null;
    this.endDate = null;
    this.entityName = null;
    this.major = null;
    this.grade = null;
    this.level = null;
    this.geolocation = null;
    this.position = null;
    this.name = null;
    this.title = null;
    this.skill = null;
    this.file = null;
    this.description = null;
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
    var data = baseExp;
    // console.log(data);
    await this.commDbService.updateUserDocArray(this.uid, this.infoType, data, true).then(res => {
      console.log("Added new ",this.infoType," for "+this.uid, res);
    }, err => reject(err));
    await this.refresh();
    this.clearInput();
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
    var newData = {
      startDate: this.editStartDate ? this.editStartDate : oldData.startDate,
      endDate: this.editEndDate ? this.editEndDate : oldData.endDate,
      entityName: this.editEntityName ? this.editEntityName : oldData.entityName,
      description: this.editDescription ? this.editDescription : oldData.description
    };

    switch(this.infoType){
      case "eduExps":
        newData['major'] = this.editMajor ? this.editMajor : oldData.major;
        newData['grade'] = this.editGrade ? this.editGrade : oldData.grade;
        newData['level'] = this.editLevel ? this.editLevel : oldData.level;
        newData['geolocation'] = this.editGeolocation ? this.editGeolocation : oldData.geolocation;
        break;
      case "projExps":
        newData['position'] = this.editPosition ? this.editPosition : oldData.position;
        newData['name'] = this.editName ? this.editName : oldData.name;
        break;
      case "workExps":
        newData['geolocation'] = this.editGeolocation ? this.editGeolocation : oldData.geolocation;
        newData['position'] = this.editPosition ? this.editPosition : oldData.position;
        break;
      case "honors":
        newData['title'] = this.editTitle ? this.editTitle : oldData.title;
        break;
    }
    console.log(newData);
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
    this.clearInput();
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
    this.description = null;
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
