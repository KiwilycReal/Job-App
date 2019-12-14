import { TestBed } from '@angular/core/testing';

import { CommDbService } from './comm-db.service';

describe('CommDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommDbService = TestBed.get(CommDbService);
    expect(service).toBeTruthy();
  });
});
