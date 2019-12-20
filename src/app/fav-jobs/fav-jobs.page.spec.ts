import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FavJobsPage } from './fav-jobs.page';

describe('FavJobsPage', () => {
  let component: FavJobsPage;
  let fixture: ComponentFixture<FavJobsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavJobsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FavJobsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
