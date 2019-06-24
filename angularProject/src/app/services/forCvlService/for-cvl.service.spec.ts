import { TestBed } from '@angular/core/testing';

import { ForCvlService } from './for-cvl.service';

describe('ForCvlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForCvlService = TestBed.get(ForCvlService);
    expect(service).toBeTruthy();
  });
});
