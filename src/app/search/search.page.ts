import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { JobInfo } from '../job-card/job-card.module';
import { JobCardService } from '../job-card/job-card.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  jobs: JobInfo[];
  @Output() newjobs = new EventEmitter<JobInfo[]>();

  refreshCard(event){
    console.log('Start');
    setTimeout(() => {
      this.jobs = this.jobser.get_jobinfo();
      this.newjobs.emit(this.jobs);
      console.log('Async operation has ended');
      event.target.complete();
    }, 1500);
  }


  constructor(private jobser: JobCardService) { }

  ngOnInit() {
    this.jobs = this.jobser.get_jobinfo();
    this.newjobs.emit(this.jobs);
  }

}
