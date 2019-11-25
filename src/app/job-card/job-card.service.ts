import { Injectable } from '@angular/core';
import { JobInfo } from './job-card.module';

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
    IntoText: "大家好，我是练习时长两年半的个人练习生蔡徐坤",
    Details: null
  },
  {
    ID:'j2',
    ImageUrl: '../assets/cxk.jpg',
    Title: "NBSL有限公司",
    Salary: 30,
    IntoText: "喜欢唱跳rap篮球，music",
    Details: null
  }

  ];

  get_jobinfo(){
    // console.log('HelloWorld');
    return [...this.jobinfos];
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

  constructor() { }
}
