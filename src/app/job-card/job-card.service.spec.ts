import { TestBed } from '@angular/core/testing';

import { JobCardService } from './job-card.service';

describe('JobCardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobCardService = TestBed.get(JobCardService);
    expect(service).toBeTruthy();
  });
});
