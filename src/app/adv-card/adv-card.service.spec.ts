import { TestBed } from '@angular/core/testing';

import { AdvCardService } from './adv-card.service';

describe('AdvCardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdvCardService = TestBed.get(AdvCardService);
    expect(service).toBeTruthy();
  });
});
