import { TestBed } from '@angular/core/testing';

import { AgendaService } from './agenda.service';
import { HttpClientModule } from '@angular/common/http';

describe('AgendaService', () => {
  let service: AgendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(AgendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
