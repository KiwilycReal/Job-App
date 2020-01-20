import { Component, OnInit, Inject } from '@angular/core';

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

  async tryLogin(){
    var msg: string;
    var isLogged = false;
    let data = this.loginService.loginForm.value;
    const loading = await this.loadingController.create({
      message: 'Logging, Please wait...',
      duration: 10000
    });
    await loading.present();
    await this.loginService.userLogin(data).then(
      res => {
        console.log("Login Result:", res);
        msg = "Login success!";
        isLogged = true;
        this.loginService.loginForm.reset();
      }, err => {
        console.log("Login Error: ", err.message);
        msg = "Login failed: " + err.message;
      });
    this.loadingController.dismiss();
    this.presentToast(msg)
    if(isLogged) this.router.navigate(['personal-info']);
  }

  async presentToast(msg: string, time: number = 2500){
    const toast = await this.toastController.create({
      message: msg,
      position: "middle",
      showCloseButton: true,
      duration: time
    });
    await toast.present();
  }

  ngOnInit() {}

}
