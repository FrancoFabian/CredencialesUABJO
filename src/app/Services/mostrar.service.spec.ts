import { TestBed } from '@angular/core/testing';

import { MostrarService } from './mostrar.service';

describe('MostrarService', () => {
  let service: MostrarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MostrarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
