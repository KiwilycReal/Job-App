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
    ID: new FormControl(''),
    ImageUrl: new FormControl(''),
    Title: new FormControl(''),
    Salary: new FormControl(''),
    IntroText: new FormControl(''),
    Details: new FormControl('')
  });

  jobinfos: JobInfo[] = [
  {
    ID:'j1',
    ImageUrl: '../assets/cxk.jpg',
    Title: "NMSL有限公司",
    Salary: 30,
    IntroText: "大家好，我是练习时长两年半的个人练习生蔡徐坤",
    Details: null
  },
  {
    ID:'j2',
    ImageUrl: '../assets/cxk.jpg',
    Title: "NBSL有限公司",
    Salary: 30,
    IntroText: "喜欢唱跳rap篮球，music",
    Details: null
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
    return this.fs.collection('Jobs', ref => {
      return ref.where("Salary", ">", 100);
    }).snapshotChanges();
  }

  testdb(){
    return this.fs.collection('Jobs').snapshotChanges().subscribe(res => {
      return res.map(j => {
        return <JobInfo> j.payload.doc.data();
      })})
  }

  get_jobInfo_byID(houseI: string) {
    return {
      ... this.jobinfos.find(hi => {
      return hi.ID === houseI;
    })
   };
  }

  createJob(data){
    return new Promise<any>((resolve, reject) => {
      this.fs.collection("Jobs").add(data).then(res => {},
          err => reject(err));
    })
  }

  set_jobInfo(jobDetails: JobInfo){
    this.jobinfos.unshift(jobDetails);
  }

  constructor(private fs: AngularFirestore) { }
}
