import { Component, OnInit, Inject } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { reject } from 'q';
import * as InfoInterfaces from '../interfaces/resume-interfaces'
import { database } from 'firebase';

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


  testexp: InfoInterfaces.WorkExperience;
  uid;
  list;
  input1;
  input2;
  input3;
  infoType: string;
  editMode: boolean = false;

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
  addExp(){
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
    this.commDbService.updateUserDocArray(this.uid, this.infoType, data, true).then(res => {
      console.log("Added new ",this.infoType," for "+this.uid, res);
    }, err => reject(err));
  }

  async editExp(id: number){
    //TODO: Interact with DOM
    //Database interactions
    const loading = await this.loadingController.create({
      message: 'Processing',
      duration: 15000
    });
    await loading.present();
    let oldData= this.list[id];
    delete oldData.id;
    var newData;
    await this.commDbService.updateUserDocArray(this.uid, this.infoType, oldData, false).then(res => {
      console.log("Removed work exp for "+this.uid, res);
    }, err => reject(err));
    await this.commDbService.updateUserDocArray(this.uid, this.infoType, newData, true).catch(
      err => console.log(err)
    )
    await this.refresh();
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

  editOther(id: number){

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
