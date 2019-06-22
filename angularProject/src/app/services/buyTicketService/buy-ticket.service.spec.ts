import { TestBed } from '@angular/core/testing';

import { BuyTicketService } from './buy-ticket.service';

describe('BuyTicketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuyTicketService = TestBed.get(BuyTicketService);
    expect(service).toBeTruthy();
  });
});
