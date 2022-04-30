import { TestBed } from '@angular/core/testing';

import { InitGuard } from './init.guard';

describe('InitGuard', () => {
  let guard: InitGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InitGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
