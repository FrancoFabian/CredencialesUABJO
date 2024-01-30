import { TestBed } from '@angular/core/testing';

import { CrearCredentialsService } from './crear-credentials.service';

describe('CrearCredentialsService', () => {
  let service: CrearCredentialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearCredentialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
