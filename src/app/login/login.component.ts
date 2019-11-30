import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';

import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(@Inject('loginService') private loginService,
              private router: Router,
              public loadingController: LoadingController) {}

  tryLogin(){
    let data = this.loginService.loginForm.value;
    console.log("User entered: "+data);
    this.loginService.userLogin(data).then(res => {
      console.log("Login Result: ");
      console.log(res);
    }, err => {
      console.log("Login Error: ");
      console.log(err);
    });
    this.testLoading();
  }

  tryRegister(){
    let data = this.loginService.registerForm.value;
    console.log("User entered: "+data.toString());
    this.loginService.userRegister(data).then(res => {
      console.log("Register Result: ");
      console.log(res);
      console.log(res.additionalUserInfo.isNewUser);
    }, err => {
      console.log("Register Error: ");
      console.log(err);
    });
    this.router.navigate(['personal-info']);
  }

  async testLoading() {
    const loading = await this.loadingController.create({
      message: 'Wait for pi page...',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('dismissed');
    this.router.navigate(['personal-info'], {state: {hello: "world"}});
  }

  ngOnInit() {}

}
