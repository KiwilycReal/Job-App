import { Injectable } from '@angular/core';
import { Adv } from './adv.module';

@Injectable({
  providedIn: 'root'
})
export class AdvService {

  // test adv info
  advs: Adv[] = [
    {
      ID: 'a1',
      ImageUrl: '../assets/melbourne1.jpg',
      Detail: null
    },
    {
      ID: 'a2',
      ImageUrl: '../assets/melbourne2.jpg',
      Detail: null
    }
  ];


  get_advs() {
    return [...this.advs];
  }


  constructor() { }
}
