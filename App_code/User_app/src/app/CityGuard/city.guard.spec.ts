/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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