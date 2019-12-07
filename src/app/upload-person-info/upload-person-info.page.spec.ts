import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPersonInfoPage } from './upload-person-info.page';

describe('UploadPersonInfoPage', () => {
  let component: UploadPersonInfoPage;
  let fixture: ComponentFixture<UploadPersonInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPersonInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPersonInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
