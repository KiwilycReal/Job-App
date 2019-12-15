import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';

import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(@Inject('loginService') private loginService,
              private router: Router,
              public loadingController: LoadingController,
              public toastController: ToastController) {}

  tryLogin(){
    let data = this.loginService.loginForm.value;
    // var loginSuccess = false;
    // var errMsg = "";
    // console.log("User entered: "+data);
    this.loginService.userLogin(data).then(res => {
      console.log("Login Result: ");
      console.log(res);
      this.testLoading();
    }, err => {
      console.log("Login Error: ", err.message);
      this.testLoading(err.message);
      // console.log(err);
    });
    // console.log(errMsg);
  }

  async testLoading(errMsg?: string) {
    const loading = await this.loadingController.create({
      message: 'Logging, Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('dismissed');
    if(!errMsg){
      this.router.navigate(['personal-info'], {state: {hello: "world"}});
    }else{
      this.testToast(errMsg);
    }
  }

  async testToast(errMsg){
    const toast = await this.toastController.create({
      message: errMsg,
      position: "middle",
      showCloseButton: true,
      duration: 2500
    });
    toast.present();
  }

  ngOnInit() {}

}
