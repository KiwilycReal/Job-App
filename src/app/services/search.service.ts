import { Injectable } from '@angular/core';
import { JobInfo } from '../job-card/job-card.module';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  jobList: JobInfo[];

  
  constructor() { }
}
