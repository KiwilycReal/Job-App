import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontPagePage } from './front-page.page';

describe('FrontPagePage', () => {
  let component: FrontPagePage;
  let fixture: ComponentFixture<FrontPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
