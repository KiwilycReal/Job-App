import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  private unreadMsgCountSource = new BehaviorSubject(0);
  currentUnreadMsgCount = this.unreadMsgCountSource.asObservable();

  private userMetadataSource = new BehaviorSubject("");
  currentUserMetadata = this.userMetadataSource.asObservable();

  constructor() { }

  changeUnreadMsgCount(count: number){
    console.log(count);
    this.unreadMsgCountSource.next(count);
  }

  changeUserMetadata(metadata: any){
    this.userMetadataSource.next(metadata);
  }
}
