import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mine',
  templateUrl: './mine.page.html',
  styleUrls: ['./mine.page.scss'],
})
export class MinePage implements OnInit {

  // The subscription of the user auth state
  authSubscription;

  isLogged;
  curUser;
  curUserDoc = {
    mobile: "",
    wechat: ""
  };
  curDisplayName;
  curAvatarUrl;

  displayNameSubscription;



  constructor(@Inject('loginService') public loginService,
              @Inject('commDbService') public commDbService,
              @Inject('shareDataService') public shareDataService) { }

  async initialize(){
    var authState: Observable<any> = this.loginService.curAuthState;
    await new Promise((resolve, reject) => {
      //Monitor user authstate changes
      if(this.authSubscription) return "Auth subscription existed";
      this.authSubscription = authState.subscribe(
        async value => {
          if(value){
            // if(this.displayNameSubscription) this.displayNameSubscription.unsubscribe();
            this.displayNameSubscription = this.shareDataService.currentUserMetadata.subscribe(
              msg => {
                this.curDisplayName = msg.displayName;
                this.curAvatarUrl = msg.avatarUrl;
              }
            );
            //If authstate become logged
            this.isLogged = true;
            this.curUser = value;
            if(value.displayName != "" && value.photoURL != "") {
              this.curDisplayName = value.displayName;
              this.curAvatarUrl = value.photoURL;
            }
            await this.commDbService.fetchUserDoc(value.uid).then(
              res => {
                console.log(res.data());
                this.curUserDoc = res.data();
              }
            );
            resolve(value);
          }else{
            if(this.displayNameSubscription) this.displayNameSubscription.unsubscribe();
            this.isLogged = false;
            this.curUser = null;
            this.curDisplayName = "请先登录";
            this.curAvatarUrl = "../assets/icon/user.svg";
            reject(null);
          }
        }
      )
    });
  }

  logout(){
    this.loginService.userLogout().then(
      res => console.log("Log out success"),
      err => console.log("Log out error")
    );
  }

  ngOnInit() {
    this.initialize();
  }

}
