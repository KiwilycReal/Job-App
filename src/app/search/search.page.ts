import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { JobInfo } from '../job-card/job-card.module';
import { JobCardService } from '../job-card/job-card.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  public searchTerm: String = "";
  jobs: JobInfo[];
  testt: JobInfo[];
  @Output() newjobs = new EventEmitter<JobInfo[]>();

  // testt: Observable<any>;
  

  refreshCard(event){
    console.log('Start');
    setTimeout(() => {
      this.jobs = this.jobser.get_jobinfo();
      this.jobser.get_jobinfo_db().subscribe(res => {
        this.testt = res.map(j => {
          return <JobInfo> j.payload.doc.data();
        });
        // this.jobs.unshift(this.testt);
        // let data: JobInfo = res[0].payload.doc.data();
        // this.jobs.unshift(data);
        this.jobs = this.testt.concat(this.jobs);
      });
      this.newjobs.emit(this.jobs);
      console.log('Async operation has ended');
      event.target.complete();
    }, 1500);
  }

  selectChange(ev){
    console.dir(ev);
  }

  testSearch(){
    console.dir(this.searchTerm);
  }


  constructor(private jobser: JobCardService) { }

  ngOnInit() {
    this.jobs = this.jobser.get_jobinfo();
    this.newjobs.emit(this.jobs);
  }

}
