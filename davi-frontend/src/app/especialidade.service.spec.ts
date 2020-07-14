import { TestBed } from '@angular/core/testing';

import { EspecialidadeService } from './especialidade.service';
import { HttpClientModule } from '@angular/common/http';

describe('EspecialidadeService', () => {
  let service: EspecialidadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClientModule],
    });
    service = TestBed.inject(EspecialidadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
