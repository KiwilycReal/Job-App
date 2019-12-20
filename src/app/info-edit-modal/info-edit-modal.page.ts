import { Component, OnInit, Inject } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { reject } from 'q';
import * as ExpInterfaces from '../interfaces/resume-interfaces'
import { database } from 'firebase';

@Component({
  selector: 'app-info-edit-modal',
  templateUrl: './info-edit-modal.page.html',
  styleUrls: ['./info-edit-modal.page.scss'],
})
export class InfoEditModalPage implements OnInit {
  testexp: ExpInterfaces.WorkExperience;
  title;
  uid;
  list;
  input1;
  input2;
  input3;

  constructor(public modalController: ModalController,
              @Inject('commDbService') public commDbService,
              navParams: NavParams) {
    // this.title = navParams.get('title');
    this.uid = navParams.get('uid');
    // this.list = navParams.get('list');
    this.commDbService.fetchUserDoc(this.uid).then(
      res => {
        // console.log("array?",res.payload.data());
        console.log(res);
        this.list = res.data().workExp;
        let i=0;
        this.list.map(item => {
          item.id = i++;
        })
      },
      err => reject(err)
    );
    console.log("Modal received", navParams.data);
    
  }

  async selfDismiss() {
    this.modalController.dismiss({
      dismissed: true
    })
  }

  addWorkExp(){
    if(!this.input1) this.input1="CXK";
    if(!this.input2) this.input2="CEO";
    if(!this.input3) this.input3="唱，跳，rap，足球";
    this.testexp = {
      position: this.input2,
      startDate: "2019-01-01",
      endDate: "2019-12-31",
      geolocation: "Melb",
      entityName: this.input1,
      description: this.input3
    }
    let data = this.testexp;
    this.commDbService.updateUserDocArray(this.uid, "workExp", data, true).then(res => {
      console.log("Added new work exp for "+this.uid, res);
    }, err => reject(err));
  }

  deleteWorkExp(id:number){
    let data= this.list[id];
    delete data.id;
    console.log("gonna deleted:",data);
    this.commDbService.updateUserDocArray(this.uid, "workExp", data, false).then(res => {
      console.log("Removed work exp for "+this.uid, res);
    }, err => reject(err));
  }

  ngOnInit() {
  }

}
