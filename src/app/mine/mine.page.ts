import { Component, OnInit, Inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-mine',
  templateUrl: './mine.page.html',
  styleUrls: ['./mine.page.scss'],
})
export class MinePage implements OnInit {

  // The subscription of the current user
  currentUserSubscription;
  // The subscription of the current user display name
  displayNameSubscription;

  curUser;
  curDisplayName;
  curAvatarUrl;
  curUserDoc = {
    mobile: "",
    wechat: ""
  };

  constructor(@Inject('loginService') public loginService,
              @Inject('commDbService') public commDbService,
              @Inject('shareDataService') public shareDataService,
              private loadingController: LoadingController) { }

  logout(){
    this.loginService.userLogout().then(
      res => console.log("Log out success"),
      err => console.log("Log out error")
    );
  }

  async initialize(){
    this.displayNameSubscription = this.shareDataService.currentUserMetadata.subscribe(
      data => {
        this.curDisplayName = data.displayName;
        this.curAvatarUrl = data.avatarUrl;
      }
    );

    this.currentUserSubscription = this.loginService.currentUser.subscribe(
      user => {
        this.curUser = user;
        console.log("mine.page got current user:", this.curUser);
        if(user){
          // Fetch curuser's userdoc
          this.commDbService.fetchUserDoc(user.uid).then(
            res => {
              this.curUserDoc = res.data();
              console.log("mine.page got current userdoc:", this.curUserDoc);
            }
          );
        }
      }
    );
  }

  ngOnInit() {
    // Set current user subscription to real-time change elements on the page
    this.initialize();
  }

}
