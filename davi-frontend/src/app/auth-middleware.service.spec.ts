import { TestBed } from '@angular/core/testing';

import { AuthMiddlewareService } from './auth-middleware.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthMiddlewareService', () => {
  let service: AuthMiddlewareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClientModule],
      imports: [HttpClientModule, RouterTestingModule]
    });
    service = TestBed.inject(AuthMiddlewareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
