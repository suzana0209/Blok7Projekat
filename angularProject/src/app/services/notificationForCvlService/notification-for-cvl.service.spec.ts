import { TestBed } from '@angular/core/testing';

import { NotificationForCvlService } from './notification-for-cvl.service';

describe('NotificationForCvlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationForCvlService = TestBed.get(NotificationForCvlService);
    expect(service).toBeTruthy();
  });
});
