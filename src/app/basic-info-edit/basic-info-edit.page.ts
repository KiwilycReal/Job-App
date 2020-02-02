import { Component, OnInit, Inject } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-basic-info-edit',
  templateUrl: './basic-info-edit.page.html',
  styleUrls: ['./basic-info-edit.page.scss'],
})
export class BasicInfoEditPage implements OnInit {

  curUserDoc;
  curUser;

  // The chosen avatar file
  file;
  // The download url for uploaded avatar
  avatarUrl;

  // Variables for user input
  editTitle;
  editLastName;
  editMiddleName;
  editFirstName;
  editGender;
  editMobile;
  editWechat;
  editEmail;
  editPreferJob;
  editPreferLocation;
  editPreferSalary;
  editWorkYear;

  // Avatar preview
  tempImgUrl;
  // Flag determine whether the avatar btn be disabled
  disableBtn = true;

  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    private sanitizer: DomSanitizer,
    @Inject('commDbService') public commDbService) { }

  selfDismiss(){
    this.modalController.dismiss({
      dismissed: true,
      avatarUrl: this.avatarUrl,
      displayName: this.curUserDoc.title+""+this.curUserDoc.firstName+" "+this.curUserDoc.lastName
    })
  }

  async update(){
    var obj = {
      title: this.curUserDoc.title,
      lastName: this.curUserDoc.lastName,
      middleName: this.curUserDoc.middleName,
      firstName: this.curUserDoc.firstName,
      gender: this.curUserDoc.gender,
      mobile: this.curUserDoc.mobile,
      wechat: this.curUserDoc.wechat,
      // email: this.editEmail,
      preferJob: this.curUserDoc.preferJob,
      preferLocation: this.curUserDoc.preferLocation,
      preferSalary: this.curUserDoc.preferSalary,
      workYear: this.curUserDoc.workYear,
      displayName: this.curUserDoc.title+""+this.curUserDoc.firstName+" "+this.curUserDoc.lastName
    };
    console.log(obj);
    const loading = await this.loadingController.create({
      message: "Updating",
      duration: 20000
    });
    await loading.present();
    this.commDbService.updateUserDoc(this.curUser.uid, obj).then(
      this.curUser.updateProfile({
        displayName: obj.title+""+obj.firstName+" "+obj.lastName
      }).then(
        res => {
          this.loadingController.dismiss();
          this.selfDismiss();
        }
      )
    )
  }

  getCurrentFile(f){
    this.disableBtn = false;
    this.file = f;
    console.log(f);
    this.tempImgUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(f));
  }

  async updateAvatar(){
    const loading = await this.loadingController.create({
      message: 'Adding...',
      duration: 20000
    });
    await loading.present();
    await this.commDbService.uploadFile(this.file, this.curUser.uid).then(
      res => {
        this.avatarUrl = res;
        this.curUser.updateProfile({
          photoURL: res
        })
        this.commDbService.updateUserDoc(this.curUser.uid, {avatarUrl: res});
      }
    );
    this.loadingController.dismiss();
  }

  ngOnInit() {
    console.log(this.curUserDoc)
  }

}
