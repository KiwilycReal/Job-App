import { Component, OnInit, Inject } from '@angular/core';

import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
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
              public toastController: ToastController,
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

  tryRegister(){
    let data = this.userDetailForm.value;
    let t = {
      email: data.email,
      password: data.password
    }
    
    this.loginService.userRegister(t).then(
      res => {
        delete data.password;
        data.workExps = [];
        data.eduExps = [];
        data.projExps = [];
        data.honors = [];
        data.files = [];
        data.description = "";
        data.skills = [];
        data.favourite = [];
        data.history =[];
        this.testLoading();
        this.loginService.curDisplayName = data.firstName;
        this.loginService.changeDisplayName(data.firstName);
        res.user.updateProfile({
          displayName: data.firstName,
          photoURL: "http://i0.hdslb.com/bfs/archive/1ebcd228cec3f5104031fa9a9f8d113ccbd082db.jpg"
        }).then(function(){
          console.log("Update success");
        }).catch(function(error){
          console.log(error);
        });
        console.log("Default display name set");
        this.commDbService.createUserDoc(res.user.uid, data).then(
          res => {
            console.dir("Finally done", res);
            this.testToast("You are all set!:)");
            console.log(this.loginService);
          }, err => {
            console.dir("Error create user info", err);
            this.testToast("Failed to create user info doc")
          }
        )
      }, err => {
        console.dir("register error ", err);
        this.testLoading(err.message);
      }
    );
    // this.router.navigate(['login']);
  }

  async testLoading(errMsg?: string) {
    const loading = await this.loadingController.create({
      message: 'Registering, Please wait...',
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
      position: "top",
      showCloseButton: true,
      color: "dark",
      duration: 2500
    });
    toast.present();
  }

  ngOnInit() {
  }

}
