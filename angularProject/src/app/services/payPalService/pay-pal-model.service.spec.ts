import { TestBed } from '@angular/core/testing';

import { PayPalModelService } from './pay-pal-model.service';

describe('PayPalModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PayPalModelService = TestBed.get(PayPalModelService);
    expect(service).toBeTruthy();
  });
});
