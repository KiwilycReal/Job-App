import { Component, OnInit, Inject } from '@angular/core';

// import { SecondService } from "../second.service";

@Component({
  selector: 'app-first',
  template: `
    <p>
      first works!
    </p>
    <div>
      <input type="text"><br/>
      <input type="password"><br/>
    </div>
    <form [formGroup]="this.secondService.form">
    <input placeholder="Username"
           formControlName="username"
           type="text"
           #username><br/>
    <input placeholder="Password"
           formControlName="password"
           type="text"
           #password><br/>
    <button (click)="onSubmit()">GOGOGO</button>
    </form>
  `,
  styles: []
})
export class FirstComponent implements OnInit {

  // constructor(private secondService:SecondService) { }
  constructor(@Inject('secondService') private secondService) { }

  ngOnInit() {
    this.secondService.tt();
  }

  onClickRegister(username, password){
    console.log(username+'+'+password+'\n');
  }

  onSubmit(){
    let data = this.secondService.form.value;
    console.log(data);
    this.secondService.createDoc(data).then(res => {
      console.log("doc pushed to firebase!");
    });

    this.secondService.register(data).then(res => {
      console.log(res);
    }, err => {
      console.log(err);
    })
  }

}
