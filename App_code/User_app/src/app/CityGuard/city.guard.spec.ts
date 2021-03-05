/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { CityGuard } from './city.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CityGuard]
    });
  });

  it('should ...', inject([CityGuard], (guard: CityGuard) => {
    expect(guard).toBeTruthy();
  }));
});