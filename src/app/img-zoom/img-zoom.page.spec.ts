import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImgZoomPage } from './img-zoom.page';

describe('ImgZoomPage', () => {
  let component: ImgZoomPage;
  let fixture: ComponentFixture<ImgZoomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgZoomPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImgZoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
