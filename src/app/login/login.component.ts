import { Component, OnInit, Inject } from '@angular/core';

import * as firebase from 'firebase/app'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(@Inject('loginService') private loginService, private router: Router) {}

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
    this.router.navigate(['front-page']);
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
    this.router.navigate(['front-page']);
  }



  ngOnInit() {
    this.loginService.fa.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    this.loginService.userAuthState();
  }

}
