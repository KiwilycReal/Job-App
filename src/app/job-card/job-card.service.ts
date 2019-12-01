import { Injectable } from '@angular/core';
import { JobInfo } from './job-card.module';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JobCardService {

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

  get_jobinfo(){
    // console.log('HelloWorld');
    return [...this.jobinfos];
  }

  get_jobinfo_db(){
    return this.fs.collection('Jobs').snapshotChanges();
  }

  get_jobInfo_byID(houseI: string) {
    return {
      ... this.jobinfos.find(hi => {
      return hi.ID === houseI;
    })
   };
  }

  set_jobInfo(jobDetails: JobInfo){
    this.jobinfos.unshift(jobDetails);
  }

  filteredJobs(query): JobInfo[] {
    
    return undefined;
  }

  constructor(private fs: AngularFirestore) { }
}
