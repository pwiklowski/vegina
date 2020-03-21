import { TestBed } from '@angular/core/testing';

import { VegeService } from './vege.service';

describe('VegeService', () => {
  let service: VegeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VegeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
