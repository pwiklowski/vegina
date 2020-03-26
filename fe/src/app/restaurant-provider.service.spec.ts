import { TestBed } from '@angular/core/testing';

import { RestaurantProviderService } from './restaurant-provider.service';

describe('RestaurantProviderService', () => {
  let service: RestaurantProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
