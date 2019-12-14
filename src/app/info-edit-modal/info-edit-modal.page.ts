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

  constructor(public modalController: ModalController,
              @Inject('commDbService') public commDbService,
              navParams: NavParams) {
    // this.title = navParams.get('title');
    this.uid = navParams.get('uid');
    // this.list = navParams.get('list');
    this.commDbService.fetchUserDoc(this.uid).subscribe(
      res => {
        // console.log("array?",res.payload.data());
        this.list = res.payload.data().workExp;
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
    this.testexp = {
      position: "CEO",
      startDate: "2019-01-01",
      endDate: "2019-12-31",
      geolocation: "Melb",
      entityName: "CXK",
      description: "唱，跳，rap，足球"
    }
    let data = this.testexp;
    this.commDbService.updateUserDocWorkExp(this.uid, data, true).then(res => {
      console.log("Added new work exp for "+this.uid, res);
    }, err => reject(err));
  }

  deleteWorkExp(id:number){
    let data= this.list[id];
    delete data.id;
    console.log("gonna deleted:",data);
    this.commDbService.updateUserDocWorkExp(this.uid, data, false).then(res => {
      console.log("Removed work exp for "+this.uid, res);
    }, err => reject(err));
  }

  ngOnInit() {
  }

}
