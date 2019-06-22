import { TestBed } from '@angular/core/testing';

import { LineStationService } from './line-station.service';

describe('LineStationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LineStationService = TestBed.get(LineStationService);
    expect(service).toBeTruthy();
  });
});
