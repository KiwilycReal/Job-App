import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BasicInfoEditPage } from './basic-info-edit.page';

describe('BasicInfoEditPage', () => {
  let component: BasicInfoEditPage;
  let fixture: ComponentFixture<BasicInfoEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicInfoEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BasicInfoEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
