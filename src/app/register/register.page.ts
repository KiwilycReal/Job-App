import { Component, OnInit, Inject } from '@angular/core';

import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  userDetailForm = this.formBuilder.group({
    title: ['', Validators.required],
    firstName: ['', Validators.required],
    middleName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    dob: [''],
    wechat: [''],
    mobile: [''],
    password: ['']
  })

  curDisplayName;
  curUser;

  constructor(
              private router: Router,
              @Inject('commDbService') public commDbService,
              @Inject('loginService') public loginService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              private formBuilder: FormBuilder) {}

  async tryRegister(){
    var isLogged = false;
    let data = this.userDetailForm.value;
    let credential = {
      email: data.email,
      password: data.password
    }

    const loading = await this.loadingController.create({
      message: 'Registering, Please wait...',
      duration: 15000
    });
    await loading.present();
    
    await this.loginService.userRegister(credential).then(
      res => {
        this.userDetailForm.reset();
        this.curUser = res.user;
        isLogged = true;
        delete data.password;
        data.workExps = [];
        data.eduExps = [];
        data.projExps = [];
        data.honors = [];
        data.files = [];
        data.description = "";
        data.skills = [];
        data.favourite = [];
        data.history = [];
        data.chats = {};
        data.talked = [];
        this.curDisplayName = data.title+data.firstName+" "+data.lastName;
        this.loginService.changeDisplayName(this.curDisplayName);
      }, err => {
        console.dir("Register error ", err.message);
        this.presentToast("Register error "+err.message);
      }
    );
    //Set initial display name
    if(!isLogged) {
      this.loadingController.dismiss();
      return;
    }
    await this.curUser.updateProfile({
      displayName: this.curDisplayName,
      photoURL: "http://i0.hdslb.com/bfs/archive/1ebcd228cec3f5104031fa9a9f8d113ccbd082db.jpg"
    }).then(
      res => console.log("Initial dp name set"),
      err => console.log("Failed to set initial dp name:",err.message)
    );
    //Create userinfo doc
    await this.commDbService.createUserDoc(this.curUser.uid, data).then(
      res => {
        console.dir("Userinfo doc created", res);
        this.presentToast("You are all set!:)");
      }, err => {
        console.dir("Failed to create userinfo doc", err);
        this.presentToast("Failed to create userinfo doc")
      }
    );
    this.router.navigate(['personal-info']);
    this.loadingController.dismiss();
  }

  async presentToast(msg, time: number = 2500){
    const toast = await this.toastController.create({
      message: msg,
      position: "top",
      showCloseButton: true,
      duration: time
    });
    toast.present();
  }

  ngOnInit() {}

}
