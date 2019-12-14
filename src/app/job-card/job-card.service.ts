import { Injectable } from '@angular/core';
import { JobInfo } from './job-card.module';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { resolve } from 'url';



@Injectable({
  providedIn: 'root'
})
export class JobCardService {

  jobForm = new FormGroup({
    // jid: new FormControl(''),
    imageUrl: new FormControl(''),
    title: new FormControl(''),
    salary: new FormControl(''),
    introText: new FormControl(''),
    details: new FormControl(''),
    position: new FormControl(''),
    publishDateTime: new FormControl(''),
    lastEditDateTime: new FormControl(''),
    geolocation: new FormControl('')
  });

  jobinfos: JobInfo[] = [
  {
    imageUrl: '../assets/cxk.jpg',
    title: "NMSL有限公司",
    salary: 30,
    introText: "大家好，我是练习时长两年半的个人练习生蔡徐坤",
    details: "musicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusic",
    position: "CEO",
    tags: ["NM", "SL"],
    publishDateTime: "2019-12-12",
    lastEditDateTime: null
  },
  {
    imageUrl: '../assets/cxk.jpg',
    title: "NBSL有限公司",
    salary: 30,
    introText: "喜欢唱跳rap篮球，music",
    details: "musicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusicmusic",
    position: "CFO",
    tags: ["WS", "ND"],
    publishDateTime: "2019-12-12",
    lastEditDateTime: null
  }

  ];

  getJobsFromDb(searchTerm?: String, filterRules?){

  }

  get_jobinfo(){
    // console.log('HelloWorld');
    return [...this.jobinfos];
  }

  get_jobinfo_db(){
    // return this.fs.collection('Jobs').snapshotChanges();
    return this.fs.collection('Jobs').get().toPromise();
  }

  testdb(){
    return this.fs.collection('Jobs').snapshotChanges().subscribe(res => {
      return res.map(j => {
        return <JobInfo> j.payload.doc.data();
      })})
  }

  // get_jobInfo_byID(houseI: string) {
  //   return {
  //     ... this.jobinfos.find(hi => {
  //     return hi.ID === houseI;
  //   })
  //  };
  // }

  ttt(){
    return new Promise<any>((resolve, reject) => {
      this.fs.collection("Jobs").doc("J9z6Qy3Jqtfk7LDBXviq").update({Yes:"no", No:{haha:"haha"}}).then(res=>{},err=>{reject(err)})
    });
  }

  createJob(data){
    return new Promise<any>((resolve, reject) => {
      this.fs.collection("Jobs").add(data).then(res => resolve(res),
          err => reject(err));
    })
  }

  set_jobInfo(jobDetails: JobInfo){
    this.jobinfos.unshift(jobDetails);
  }

  constructor(private fs: AngularFirestore) { }
}
