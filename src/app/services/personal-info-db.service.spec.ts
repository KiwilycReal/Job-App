import { TestBed } from '@angular/core/testing';

import { PersonalInfoDbService } from './personal-info-db.service';

describe('PersonalInfoDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonalInfoDbService = TestBed.get(PersonalInfoDbService);
    expect(service).toBeTruthy();
  });
});
