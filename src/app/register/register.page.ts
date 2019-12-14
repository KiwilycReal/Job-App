import { Component, OnInit, Inject } from '@angular/core';

import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
              private router: Router,
              @Inject('commDbService') public commDbService,
              @Inject('loginService') public loginService,
              public loadingController: LoadingController,
              private formBuilder: FormBuilder) { }

  

  userDetailForm = this.formBuilder.group({
    // uid: new FormControl(''),
    // wechat: new FormControl(''),
    // mobile: new FormControl(''),
    title: ['', Validators.required],
    // name: new FormControl(''),
    firstName: ['', Validators.required],
    middleName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    // Details: new FormControl('')
    dob: [''],
    password: ['']
  })

  register(){
    let data = this.userDetailForm.value;
    let t = {
      email: data.email,
      password: data.password
    }
    
    // console.dir(t);
    // console.log(this.userDetailForm);
    this.loginService.userRegister(t).then(
      res => {
        delete data.password;
        data.workExp = [];
        data.skills = [];
        data.favourite = [];
        data.history =[];
        this.commDbService.createUserDoc(res.user.uid, data).then(
          res => {
            console.dir("Finally done", res);
          }, err => {
            console.dir("Failed at last step", err);
          }
        )
      }, err => {
        console.dir("Error create user info ", err);
      }
    );
    this.router.navigate(['login']);
  }

  ngOnInit() {
  }

}
