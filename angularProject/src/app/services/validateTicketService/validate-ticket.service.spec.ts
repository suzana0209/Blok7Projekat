import { TestBed } from '@angular/core/testing';

import { ValidateTicketService } from './validate-ticket.service';

describe('ValidateTicketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidateTicketService = TestBed.get(ValidateTicketService);
    expect(service).toBeTruthy();
  });
});
