import { TestBed } from '@angular/core/testing';

import { JkaneSvcService } from './jkane-svc.service';

describe('JkaneSvcService', () => {
  let service: JkaneSvcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JkaneSvcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
